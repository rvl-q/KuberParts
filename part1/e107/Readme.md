# Exercise 1.07: External access with Ingress

Accessing "Log output" using Ingress.

Application source (trying out Python this times):
https://github.com/rvl-q/hashapp

Docker image:
https://hub.docker.com/repository/docker/rvlq/hasher/general (tag: 1.07)

Command used to start the cluster:
```
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
```

Command used to deploy the application:
```
x
```
logs:
[here](./e107.txt).
