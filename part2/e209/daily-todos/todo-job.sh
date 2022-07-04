#!/bin/sh
set -e

if [ $SERVER_URL ]
then
    
    WIKI=`curl -v https://en.wikipedia.org/wiki/Special:Random 2>&1 >/dev/null | grep '< location: '|cut -c13-153|tr -d "\r\n"`
    echo Wiki random url is: $WIKI
    # echo -n ${WIKI}|wc
    curl -X POST $SERVER_URL\
        -H 'Content-Type: application/json'\
        -d '{"content": "Read '${WIKI}'"}'

      echo 
      echo posted
fi