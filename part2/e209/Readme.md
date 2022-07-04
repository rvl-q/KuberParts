# Exercise 2.09: Daily todos

## Cron schedule syntax
```
# ┌───────────── minute (0 - 59)
# │ ┌───────────── hour (0 - 23)
# │ │ ┌───────────── day of the month (1 - 31)
# │ │ │ ┌───────────── month (1 - 12)
# │ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday;
# │ │ │ │ │                                   7 is also Sunday on some systems)
# │ │ │ │ │                                   OR sun, mon, tue, wed, thu, fri, sat
# │ │ │ │ │
# * * * * *
```
Using every 10h minute job for testing and switch to daily when it works.
```
spec:
  schedule: "*/10 * * * *"
```

The used [cronjob.yaml file](./daily-todos/manifests/cronjob.yaml).
```
apiVersion: batch/v1
kind: CronJob
metadata:
  name: daily-todo
spec:
  # schedule: "* * * * *"
  schedule: "*/10 * * * *"
  # schedule: "* 12 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: daily-todo
            # image: alpine/curl:3.14
            image: rvlq/daily-job:latest
            imagePullPolicy: Always
            # imagePullPolicy: IfNotPresent
            # command:
            # # - sh
            # - ./jobs/todo-job.sh; echo testing echo
            # echo `curl -v https://en.wikipedia.org/wiki/Special:Random 2>&1 >/dev/null | grep '< location: '|cut -c13-153`
          restartPolicy: OnFailure
```

The used [shell script file](./daily-todos/todo-job.sh).
```
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

      echo \nEpäile kaikkea!\nposted
fi
```


logs:
[here](./e209.txt).
