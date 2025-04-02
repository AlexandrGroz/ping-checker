import datetime
import re
import asyncio
import subprocess
from fastapi import FastAPI
from starlette.responses import FileResponse
from starlette.staticfiles import StaticFiles
from pathlib import Path

from backend.utils import get_command, is_packet_loss, extract_ping_times

app = FastAPI()

DIST_PATH = Path(__file__).parent.parent / "frontend/dist"
app.mount("/assets", StaticFiles(directory=DIST_PATH / "assets"))
app.mount("/favicons", StaticFiles(directory=DIST_PATH / "favicons"))
app.mount("/static", StaticFiles(directory=DIST_PATH / "static"))


@app.get("/")
def read_root():
    return FileResponse(DIST_PATH / "index.html")


def ping_host_sync(ip: str):
    try:
        command = get_command(ip)

        result = subprocess.run(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        output = result.stdout
        return parse_ping_result(ip, output)
    except Exception as e:
        return {"ip": ip, "error": str(e)}


async def ping_host(ip: str):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, ping_host_sync, ip)


def parse_ping_result(ip: str, output: str):
    if is_packet_loss(output):
        return {
            "status": "error",
            "ip": ip,
            "ping_ms": "n/a",
            "success_rate": "n/a",
            "fail_rate": "n/a",
            "last_success_ping": "n/a",
        }

    ping_times = extract_ping_times(output)
    avg_ping = sum(map(float, ping_times)) / len(ping_times) if ping_times else None

    loss_match = re.search(r"(\d+)% ?packet loss", output)
    loss_rate = int(loss_match.group(1)) if loss_match else 0
    success_rate = 100 - loss_rate

    return {
        "status": "success",
        "ip": ip,
        "ping_ms": round(avg_ping, 2) if avg_ping is not None else None,
        "success_rate": f"{success_rate}%",
        "fail_rate": f"{loss_rate}%",
        "last_success_ping": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }


@app.get("/ping")
async def get_ping(ip: str):
    return await ping_host(ip)
