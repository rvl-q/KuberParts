# Exercise 1.11: Persisting data

Application sources:
[ping-pong](../../ping-pong/)

Docker images:

https://hub.docker.com/r/rvlq/ping-pong/tags

(tag: 1.11)

Command used to start the cluster:
```
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
```

Command used to deploy the application:
```
kubectl apply -f manifests/
```
logs:
[here](./e111.txt).
