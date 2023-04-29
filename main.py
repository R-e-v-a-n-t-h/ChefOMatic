# BACKEND IMPORTS
import pickle
import ast
import numpy as np
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


# DATA HANDLING

app = FastAPI()


origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Load models, data and templates
detector = CompleteRecognition(0.7)    #Set Threshold
recipeModel = pickle.load(open("NearestNeighborModel.pkl", 'rb'))
data = pd.read_csv('Cleaned_Data.csv')
camera =  cv2.VideoCapture(0)
hometemplate = Jinja2Templates(directory="")

# Startup Event
@app.on_event("startup")
async def startup_event():
    # Store models in the application's state
    #Statistical ML States
    app.state.recipeModel = recipeModel
    app.state.data = data
    
    #Robot CV States
    app.state.detector = detector
    app.state.predictions=set()
    app.state.status=False

# -----------------------------------------------------------------------------------------> Using Lazeez
@app.get('/api')
async def openingPage():
    data = app.state.data
    allIngredients = data.columns.tolist()
    allIngredients.pop(0)
    allIngredients.pop(0)
    allIngredients.pop(0)
    allIngredients.pop(0)
    allIngredients.pop(0)
    indecies = {}
    dishes = np.array(data["title"]).tolist()
    for i in range(len(allIngredients)):
        indecies[allIngredients[i]] = i
    return {"ingredients": allIngredients, "indecies": indecies, "dishes": dishes}


@app.get("/api/required-ingredients")
async def requiredIngredients():
    data = app.state.data
    # data.drop_duplicates()
    ner = np.array(data["NER"]).tolist()
    x = np.array(data["title"]).tolist()
    for i in range(len(ner)):
        ner[i] = ast.literal_eval(ner[i])
    ingredients = {}
    for i in range(len(x)):
        if x[i] not in ingredients:
            ingredients[x[i]] = ner[i]
    return ingredients


@app.post("/api/specific-recipes")
async def recipes(request: Request):
    data = app.state.data
    if request:
        params = await request.json()
        dish = params["dish"]
    requestedData = data.loc[data["title"].str.contains(dish, regex=False)]
    directions = ast.literal_eval(
        np.array(requestedData["directions"]).tolist()[0])
    ingredients = ast.literal_eval(
        np.array(requestedData["ingredients"]).tolist()[0])

    return {"ingredients": ingredients, "directions": directions}


@app.post("/api/predict")
async def predict(request: Request):

    data = app.state.data
    model = app.state.recipeModel

    allIngredients = data.columns.tolist()
    allIngredients.pop(0)
    allIngredients.pop(0)
    allIngredients.pop(0)
    allIngredients.pop(0)
    allIngredients.pop(0)

    if request:
        params = await request.json()
        X = params["array"]
        picked = params["chosenIngredients"]

        if len(X) == len(allIngredients):
            predictions = model.kneighbors(np.array([X]))
            predictedData = data.iloc[predictions[1][0]]
            predictedData = classifier(predictedData, picked)
            sendData = np.array(predictedData["title"]).tolist()
            return {"predictions": sendData}
        else:
            raise HTTPException(400, "Error")

    raise HTTPException(400, "Error")
# -------------------------------------------------------------------------------> Using Lazeez

'''
# --------------------------------------------------------------------------------> Using the detector
@app.post("/predict-video")
async def predict_video(request:Request):
    if request:
        params = await request.json()
        frame=params["frame"]
        frame=base64.b64decode(frame)
    detector = app.state.detector
    # Convert bytes to numpy array
    np_frame = np.frombuffer(frame, np.uint8)
    # Decode the image
    image = cv2.imdecode(np_frame, cv2.IMREAD_COLOR)
    results = detector(image)
    return results


# --------------------------------------------------------------------------------> Using the detector
'''

#---------------------------------------------------------------------------------> Robot
def generateFrames():
    detector=app.state.detector
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
                frame = detection[0]
                
                predictions=app.state.predictions
                app.state.predictions=predictions.union(detection[1])
                cv2.putText(frame,"Activated",(x,y) ,cv2.FONT_HERSHEY_DUPLEX, 0.9, (0,255,0), 2)
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
    
#---------------------------------------------------------------------------------> Robot
