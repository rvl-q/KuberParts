# Exercise 1.11: Persisting data

Application sources:
[ping-pong](../../ping-pong/)

Docker images:

https://hub.docker.com/r/rvlq/log-output/tags

https://hub.docker.com/r/rvlq/ping-pong/tags

(tag: 1.11)

Command used to start the cluster and set up and claim the persistent volume:
```
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
kubectl apply -f https://raw.githubusercontent.com/rvl-q/KuberParts/main/part1/e111/persistentvolume.yaml
kubectl apply -f https://raw.githubusercontent.com/rvl-q/KuberParts/main/part1/e111/persistentvolumeclaim.yaml
```
The used ingress.yaml [file](./ingress.yaml)
```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: dwk-material-ingress
spec:
  rules:
  - http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: log-output-svc
            port:
              number: 2345
      - path: /pingpong
        pathType: Prefix
        backend:
          service:
            name: ping-pong-svc
            port:
              number: 1234              
```

Command used to deploy the application(s):
```
kubectl apply -f manifests/
```
logs:
[here](./e111.txt).
