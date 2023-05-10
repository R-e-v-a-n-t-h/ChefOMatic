import mysql.connector
from dotenv import load_dotenv
import os
import json

load_dotenv()

mydb = mysql.connector.connect(
    host="cloud.mindsdb.com",
    user=os.environ.get("USER"),
    password=os.environ.get("PASSWORD"),
    port="3306"
)

cursor = mydb.cursor()
text = "rice, oil, chicken, spices, salt, garammasala, curry, butter, water."
query = f'SELECT response FROM mindsdb.recipe_modelv9 WHERE text="{text}"'
cursor.execute(query)

for x in cursor:
    print(x)
    response_dict = json.loads(x[0])  # convert to dictionary
    response_dict['ingredients'] = str(response_dict['ingredients'])
    response_dict['directions'] = str(response_dict['directions'])
    response_json = json.dumps(response_dict, indent=4)  # convert back to pretty-printed JSON string

    print("response_json:", response_json)
