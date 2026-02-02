# app.py
from flask import Flask
app = Flask(__name__)

@app.route("/hello")
def hello():
    return {"message": "Hello from your Pod!"}

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
