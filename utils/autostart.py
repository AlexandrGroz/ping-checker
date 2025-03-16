import webbrowser
import subprocess
import time
import os

os.chdir('../')
subprocess.Popen(["uvicorn", "backend.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"])

time.sleep(2)

webbrowser.open("http://127.0.0.1:8000")