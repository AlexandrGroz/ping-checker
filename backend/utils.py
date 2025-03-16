import platform
import re


def get_command(ip):
    if platform.system() == "Windows":
        return ["ping", "-n", "4", ip]
    else:
        return ["ping", "-c", "4", ip]


def is_packet_loss(output: str) -> bool:
    if platform.system() == "Windows":
        return "Received = 0" in output or "100% loss" in output
    else:
        return "100% packet loss" in output


def extract_ping_times(output: str):
    if platform.system() == "Windows":
        return re.findall(r"time[=: ](\d+\.?\d*)", output)
    else:
        return re.findall(r"time[=: ](\d+\.?\d*)", output)