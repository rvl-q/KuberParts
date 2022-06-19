from typing import Union
import os, datetime as dt
from fastapi import Depends, FastAPI, Response, Form, Body

import asyncio

app = FastAPI()

_hash = os.getenv('HASH')
# _hash = 'HASH'
print('Log output started. Hash string is:', _hash)

_latest_timestamp = 'not yet started!'

async def forever():
    global _latest_timestamp
    T5S = dt.timedelta(seconds=5)
    MAGIC_CONSTANT = 0.002 # Not really necessary, as it will "self tune" anyway.
    first_timestamp = dt.datetime.now(dt.timezone.utc)
    target = first_timestamp + T5S
    while True:
        _latest_timestamp = dt.datetime.now(dt.timezone.utc)

        # the Log output
        print(f'{_latest_timestamp} {_hash}', flush=True)

        # await asyncio.sleep(5)
        # don't let it slip
        await asyncio.sleep((target - _latest_timestamp).total_seconds() - MAGIC_CONSTANT)
        target += T5S


@app.on_event("startup")
async def startup_event():
    asyncio.create_task(forever()) # start generating the timestamps


@app.get("/")
def hello():
    data = f"{_latest_timestamp} {_hash}"
    return Response(content=data, media_type="text/plain")


# def loop1():
#     S5 = dt.timedelta(seconds=5)
#     target = dt.datetime.now(dt.timezone.utc)+S5
#     while True:
#         now = dt.datetime.now(dt.timezone.utc)
#         print(now, _hash)
#         time.sleep((target-now).total_seconds()-0.005)
#         target += S5


# print('test When this is printed')
