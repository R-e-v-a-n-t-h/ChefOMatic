# BACKEND IMPORTS
import pickle
import ast
import numpy as np
from sklearn.neighbors import NearestNeighbors
import pandas as pd
from condition import *
from fastapi import FastAPI, Path, HTTPException, Request, File, UploadFile
from starlette.responses import StreamingResponse
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from complete_recognition import CompleteRecognition
import cv2
import numpy as np
import io
import base64
#minds db
import mysql.connector
import os
import json
import mediapipe as mp


app = FastAPI()


origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

def loadDishesAndIndecies(allIngredients,data):
    indecies = {}
    dishes = np.array(data["title"]).tolist()
    for i in range(len(allIngredients)):
        indecies[allIngredients[i]] = i
    return indecies, dishes

def getDishDetails(df,allIngredients,dishName):
    dishDetails={}
    # dishtemp=np.array(df[["title"]]).tolist()
    row_index = df.loc[df["title"]==dishName].index[0]
    typearray= np.array(df[["is_veg","is_halal","is_kosher","is_gluten_free","is_vegetarian"]])[row_index].tolist()
    NER= ast.literal_eval(np.array(df[["NER"]])[row_index][0])
    # row_mask = df.index == row_index
    # # get a list of column names where the row_mask is True and the value is 1
    # columns_with_ones = set(list(df.columns[(df.loc[row_mask] == 1).any()])).intersection(set(allIngredients))
    
    dishDetails={"ingredients":set([item.lower() for item in NER]),"type":typearray}
        
    return dishDetails


# Load models, data and templates
detector = CompleteRecognition(0.7)    #Set Threshold

data = pd.read_csv('Cleaned_Data.csv')
# recipeModel = pickle.load(open("NearestNeighborModel.pkl", 'rb'))
camera =  cv2.VideoCapture(0)
hometemplate = Jinja2Templates(directory="")

# Startup Event
@app.on_event("startup")
async def startup_event():
    # Store models in the application's state
    #Statistical ML States
    # app.state.recipeModel = recipeModel
    app.state.data = data
    start=10
    app.state.allIngredients= list(data.columns)[start:]
    
    app.state.recipeModel=NearestNeighbors(n_neighbors=app.state.data.shape[0], radius=0.2)
    app.state.recipeModel.fit(np.array(app.state.data[app.state.allIngredients]))
    
    app.state.indecies, app.state.dishes = loadDishesAndIndecies(app.state.allIngredients, app.state.data)
    app.state.predictedDishes = []
    
    #Robot CV States
    app.state.detector = detector
    app.state.predictions=set()
    app.state.status=False
    
    app.state.mydb = mysql.connector.connect(
    host="cloud.mindsdb.com",
    user="asils22plus@gmail.com",
    password="AsilRex01",
    port="3306"
    )
    
    app.state.hands = mp.solutions.hands.Hands()


# -----------------------------------------------------------------------------------------> Using Lazeez
@app.get('/api/ingredients')                                                             #Get List of ingredients
async def openingPage():
    allIngredients = app.state.allIngredients
    return {"ingredients": allIngredients}


@app.post("/api/dish-details")                                               # Get types and ingredients of each dish on the page
async def requiredIngredients(request:Request):
    if request:
        params = await request.json()
        dishName=params["dish"]
        dishDetails= getDishDetails(app.state.data,app.state.allIngredients, dishName)
    
        return dishDetails


@app.post("/api/specific-recipes")                                          # Get ingredients and procedure 
async def recipes(request: Request):
    data = app.state.data
    if request:
        params = await request.json()
        dish = params["dish"]
        requestedData = data.loc[data["title"]==dish]#.str.contains(dish, regex=False)
        directions = ast.literal_eval(np.array(requestedData["directions"]).tolist()[0])
        ingredients = ast.literal_eval(np.array(requestedData["ingredients"]).tolist()[0])
        link = np.array(requestedData["link"]).tolist()[0]

        return {"ingredients": ingredients, "directions": directions, "link":link}
        


@app.post("/api/make-predictions")
async def makePredictions(request: Request):                                    #Make the new Predicted Dishes list and send total number of dishes
    data = app.state.data
    model = app.state.recipeModel
    indecies = app.state.indecies
    allIngredients = app.state.allIngredients
    length = len(allIngredients)
    
    template=[0 for i in range(length)]

    if request:
        params = await request.json()
        picked = params["chosenIngredients"]
        filters = params["filters"]
        if len("chosenIngredients")==0:
            return {"totalPredictions":0}
        else:
            for ingredient in picked:
                template[indecies[ingredient]]=1
                
            predictions = model.kneighbors(np.array([template]))
            if filters==[0,0,0,0,0]:
                predictedData = data.iloc[predictions[1][0]]
            else:
                predictedData = data.iloc[predictions[1][0]]
                predictedData = predictedData.loc[
                                (predictedData["is_veg"]==filters[0]) &
                                (predictedData["is_halal"]==filters[1]) &
                                (predictedData["is_kosher"]==filters[2]) &
                                (predictedData["is_gluten_free"]==filters[3]) &
                                (predictedData["is_vegetarian"]==filters[4]) 
                                ]
            predictedData = classifier(predictedData, picked)
            predictedData = np.array(predictedData["title"]).tolist()
            app.state.predictedDishes = predictedData
            totalPredictions=len(predictedData)
            return {"totalPredictions":totalPredictions}
    


@app.post("/api/get-predictions")                                       #Get Prediction based on page number and dishes per page
async def getPredictions(request: Request):
    predictedData= app.state.predictedDishes
    totalPredictions=len(predictedData)
    if request:
        params= await request.json()
        page=params["page"]
        numberOfDishesPerPage=params["numberOfDishesPerPage"]
        Q=totalPredictions//numberOfDishesPerPage
        if page>Q:
            sendData=predictedData[(page-1)*numberOfDishesPerPage:]
        else:
            sendData=predictedData[(page-1)*numberOfDishesPerPage:page*numberOfDishesPerPage]
        return {"preditedDishes":sendData}
    



# -------------------------------------------------------------------------------> Using Lazeez


#-------------------------------------------------------------------------------------------------------------> Robot
def generateFrames():
    detector=app.state.detector
    hands = app.state.hands
    while True:
        x=400
        y=50
        status = app.state.status
        # read the camera frame
        success,frame=camera.read()
        if not success:
            break
        else:
            
            if status:
                detection = detector(frame)
                gray_image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                results = hands.process(gray_image).multi_hand_landmarks
                frame = detection[0]
                
                predictions=app.state.predictions
                app.state.predictions=predictions.union(detection[1])
                
                cv2.putText(frame,"Activated",(x,y) ,cv2.FONT_HERSHEY_DUPLEX, 0.9, (0,255,0), 2)
                
                
                
                if results is not None:
                    cv2.putText(frame,"Danger! Hands Detected",(x,y+50) ,cv2.FONT_HERSHEY_DUPLEX, 0.5, (0,0,255), 2)
                
                
                
            else:
                frame = frame
                
                cv2.putText(frame,"Deactivated",(x,y) ,cv2.FONT_HERSHEY_DUPLEX, 0.9, (0,0,255), 2)

            ret,buffer=cv2.imencode('.jpg',frame)
            frame=buffer.tobytes()

            yield(b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

        

def deactivate():
    predictions=app.state.predictions
    app.state.status=False
    app.state.predictions=set()
    return predictions

def activate():
    app.state.status=True



@app.api_route('/robot')
async def index(request: Request):
    return hometemplate.TemplateResponse("index.html",{"request":request})

@app.api_route('/robot/video')
async def video(request: Request):
    return StreamingResponse(generateFrames(), headers={"Content-Type": "multipart/x-mixed-replace; boundary=frame"})




@app.get('/robot/current-state')
async def isActive():
    return {"status":app.state.status}



    

@app.get('/robot/change-bot-state')
async def changeState():
    
    if app.state.status:
        predictions= deactivate()
        return {"status":app.state.status,"predictions":predictions}
           
    else:
        activate()
        return {"status":app.state.status,"predictions":set()}
    
#-------------------------------------------------------------------------------------------------------------> Robot


#-------------------------------------------------------------------------------------------------------------> GPT
@app.post('/gpt/get-recipe')
async def gptGetRecipe(request: Request):
    mydb= app.state.mydb
    if request:
        params = await request.json()
        picked = params["chosenIngredients"]
        text=", ".join(picked)+"."
        
        cursor = mydb.cursor()
        # text = "rice, oil, chicken, spices, salt, garammasala, curry, butter, water."
        query = f'SELECT response FROM mindsdb.recipe_modelv9 WHERE text="{text}"'
        cursor.execute(query)

        for x in cursor:
            response_dict = json.loads(x[0])  # convert to dictionary
            # response_dict['ingredients'] = str(response_dict['ingredients'])
            # response_dict['directions'] = str(response_dict['directions'])
        print(response_dict)
        return response_dict


#-------------------------------------------------------------------------------------------------------------> GPT