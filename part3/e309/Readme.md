# Exercise 3.09: Resource limits

Got up to less than `15m` by hitting reloads on my local setup.
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ping-pong-dep
  namespace: exercises
...
          resources:
              limits:
                memory: "64Mi"
                cpu: "100m"
```


Works, but would certainly get away with less, or at least add a smaller `request`.
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: log-output-dep
  namespace: exercises
...
          resources:
            limits:
              memory: "512Mi"
              cpu: "500m"
...
```

[Possible logs](e309.txt)