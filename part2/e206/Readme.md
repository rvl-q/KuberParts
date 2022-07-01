# Exercise 2.06: Documentation and ConfigMaps

Application sources:

[log-output](https://github.com/rvl-q/hashapp)

[ping-pong](../../ping-pong/)

Docker images:

https://hub.docker.com/r/rvlq/log-output/tags

(tag: 2.06)

https://hub.docker.com/r/rvlq/ping-pong/tags

(tag: 2.03 - untouched since previous version)

Command used to start the cluster:
```
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
```

The used [yaml file](./) for the ConfigMap.
```
apiVersion: v1
kind: ConfigMap
metadata:
  name: log-pong
  namespace: exercises
data:
  # property-like keys; each key maps to a simple value
  message: "Hello"
```

The used [deployment.yaml file](https://github.com/rvl-q/hashapp/blob/c8054d5b07eec289548c64ea4f6027ba55ccd2c7/manifests/deployment.yaml) that uses the above config map.
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: log-output-dep
  namespace: exercises
spec:
  replicas: 1
  selector:
    matchLabels:
      app: log-output
  template:
    metadata:
      labels:
        app: log-output
    spec:
      containers:
        - name: log-output
          image: rvlq/log-output:latest
          resources:
            limits:
              memory: "512Mi"
              cpu: "500m"
          env:
            # Define the environment variable
            - name: MESSAGE # Notice that the case is different here
                            # from the key name in the ConfigMap.
              valueFrom:
                configMapKeyRef:
                  name: log-pong # The ConfigMap this value comes from.
                  key: message # The key to fetch.

```

Command used to deploy the application(s):
```
kubectl apply -f manifests/
```
logs:
[here](./e206.txt).
