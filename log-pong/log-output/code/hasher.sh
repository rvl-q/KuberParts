#!/bin/bash
RND=`dd count=1 if=/dev/urandom 2>/dev/null | md5sum -b|cut -c1-32`
#echo $RND
export HASH=$RND

# echo $RND > app/files/rnd.fil

# while true; do
#   #TS=`date -u --rfc-3339=ns`
#   TS=`date -u -Ins`
#   #TS=`date -u -R`
#   echo $TS $RND
#   sleep 4.995;
# done