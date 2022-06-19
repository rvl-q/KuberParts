# Exercise 1.09: More services

Application source:
[ping-pong](../../ping-pong/)

Docker image:
https://hub.docker.com/r/rvlq/ping-pong/tags (tag: 1.09)

Command used to start the cluster:
```
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
```

Command used to deploy the application:
```
kubectl apply -f manifests/
```
logs:
[here](./e109.txt).
