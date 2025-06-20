from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import FileResponse
import psycopg2
from psycopg2.extras import RealDictCursor
import time
import threading

app = FastAPI()

current_message = ""
user_message = ""

#local database connection
try:
    connection = psycopg2.connect(host = 'localhost', database = 'mydb', user = 'mine', password = 'minedb', port = '5432', cursor_factory=RealDictCursor)
    db = connection.cursor()
except Exception as er:
    print(er)
    time.sleep(2)



@app.get("/", status_code=status.HTTP_200_OK)
def homepage():
    f_path = "resources/index.html"
    return FileResponse(f_path, media_type="text/html")
@app.get("/style.css", status_code=status.HTTP_200_OK)
def homepage_css():
    f_path = "resources/style.css"
    return FileResponse(f_path, media_type="text/css")
@app.get("/index.js", status_code=status.HTTP_200_OK)
def homepage_js():
    f_path = "resources/index.js"
    return FileResponse(f_path, media_type="application/javascript")

@app.get("/icons/site.webmanifest", status_code=status.HTTP_200_OK)
def manifest():
    f_path = "resources/icons/site.webmanifest"
    return FileResponse(f_path, media_type="application/manifest+json")

@app.get("/icons/apple-touch-icon.png", status_code=status.HTTP_200_OK)
def apple_touch_icon():
    return FileResponse("resources/icons/apple-touch-icon.png", media_type="image/png")
@app.get("/icons/favicon-32x32.png", status_code=status.HTTP_200_OK)
def favicon_32():
    return FileResponse("resources/icons/favicon-32x32.png", media_type="image/png")

@app.get("/icons/favicon-16x16.png", status_code=status.HTTP_200_OK)
def favicon_16():
    return FileResponse("resources/icons/favicon-16x16.png", media_type="image/png")
@app.get("/icons/favicon.ico", status_code=status.HTTP_200_OK)
def favicon():
    return FileResponse("resources/icons/favicon.ico", media_type="image/x-icon")

#parse the user sent message and check its validity
@app.post("/send")
async def receive_message(request: Request):
    global user_message
    try:
        data = await request.json()
        message = data.get("message")
        if not message:
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        print(message)
        user_message = message
        return {"status": "success", "message": "Message received"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/response', status_code=status.HTTP_200_OK)
async def option_choosed(request: Request):
    data = await request.json()
    message = data.get("message")
    print(message)
    return {"status":"success"}

@app.get('/receive', status_code=status.HTTP_200_OK)
def send_message():
    global current_message
    return {"message": current_message}

#Reset answer screen, and add to db
@app.get('/clear', status_code=status.HTTP_200_OK)
def clear_message():
    global current_message
    print(current_message)
    db.execute("""INSERT INTO results(qs, ans) VALUES (%s, %s)""", (user_message, current_message))
    connection.commit()
    current_message = ""
    return {"message": current_message}

#For terminal input, handled by a separate thread
def terminal_input():
    global current_message
    while True:
        user_input = input("Enter a message to send to frontend: ")
        current_message = user_input

threading.Thread(target=terminal_input, daemon=True).start()
