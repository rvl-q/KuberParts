# Exercise 1.10: Even more services

Application source:


Docker image:
 (tag: 1.10)

Command used to start the cluster:
```
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
```

Command used to deploy the application:
```
kubectl apply -f manifests/
```
logs:
[here](./e110.txt).
