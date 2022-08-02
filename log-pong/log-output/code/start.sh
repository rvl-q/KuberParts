#!/bin/bash

. ./hasher.sh

echo $HASH > app/files/hs.txt

# echo starting...


# (not "auto tuned", will inevitably drift..)
while true; do
  #TS=`date -u --rfc-3339=ns`
  TS=`date -u -Ins`
  #TS=`date -u -R`
  echo -n $TS > app/files/ts.txt
  sleep 4.995;
done

# uvicorn app.main:app --host 0.0.0.0 --port 7777
