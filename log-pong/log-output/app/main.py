import time
from typing import Union
import os, datetime as dt
from fastapi import Depends, FastAPI, Response, Form, Body, HTTPException

import asyncio, hashlib, urllib.request

# PING_PONG_SVC_URL = "http://ping-pong-svc.exercises:1234/pongs" # not needed
# PING_PONG_SVC_URL = "http://ping-pong-svc:1234/pongs"

PING_PONG_SVC_URL = os.getenv('PING_PONG_SVC_URL', default='http://ping-pong-svc:80/pongs')

PING_TIMEOUT = 3.0
last_error = dt.datetime(1970,1,1)

app = FastAPI()

def create_hash():
    with open('/dev/urandom', 'rb') as f:
        bino = f.read(512)
        f.close()
    return hashlib.md5(bino).hexdigest()

# _hash = os.getenv('HASH')
_hash = create_hash()

# print('Log output started. Hash string is:', _hash)

_latest_timestamp = 'not yet started!'

async def forever():
    global _latest_timestamp
    T5S = dt.timedelta(seconds=5)
    MAGIC_CONSTANT = 0.002 # Not really necessary, as it will "self tune" anyway.
    first_timestamp = dt.datetime.now(dt.timezone.utc)
    target = first_timestamp + T5S
    while True:
        _latest_timestamp = dt.datetime.now(dt.timezone.utc)

        # the Log output, disabled for now as we have other ways to see (the latest).
        # re-enabled, use: kubectl logs <podname> to read
        print(f'{_latest_timestamp} {_hash}', flush=True)

        # don't let it slip
        await asyncio.sleep((target - _latest_timestamp).total_seconds() - MAGIC_CONSTANT)
        target += T5S


# def get_latest():
#     try:
#         with open('app/shared/pongs.txt', 'r') as f:
#             pongs = int(f.read())
#     except:
#         return os.popen('ls -al app/shared').read()
#     return _latest_timestamp, pongs

def get_latest():
    global last_error
    now = dt.datetime.now()
    delta_t = now-last_error
    pongs = 0
    if (delta_t.total_seconds() < PING_TIMEOUT):
        print('recent error in getting pongs')
        return _latest_timestamp, -1
    try:
        with urllib.request.urlopen(PING_PONG_SVC_URL, timeout = 1) as f:
            dec = f.read()
            dec = dec.decode("utf-8")
            # print(dec)
            dec = int(dec)
            pongs = dec
    except Exception as e:
        last_error = now
        print('Error in reading ping URL', now, '\n', e)
        return _latest_timestamp, -1

    print('time and pongs:', _latest_timestamp, pongs)
    return _latest_timestamp, pongs

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(forever()) # start generating the timestamps


@app.get("/")
def hello():
    hello = os.getenv('MESSAGE', default='Message is NOT set!')
    ts, png = get_latest()
    data = f"{hello}\n{ts} {_hash}.\nPing / Pongs: {png}"
    return Response(content=data, media_type="text/plain")

@app.get("/healthz")
def health():
    ts, png = get_latest()
    if (png<0):
        print('500')
        raise HTTPException(status_code=500, detail="Ping not found")
    else:
        print('200')
        return Response(content='OK', media_type="text/plain")
