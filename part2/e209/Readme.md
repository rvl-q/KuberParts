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
```

The used [shell script file](./daily-todos/).
```
```


logs:
[here](./e209.txt).
