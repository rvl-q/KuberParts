# Exercise 2.03: Keep them separated

Application sources:

[log-output](https://github.com/rvl-q/hashapp)

[ping-pong](../../ping-pong/)

Docker images:

https://hub.docker.com/r/rvlq/log-output/tags

https://hub.docker.com/r/rvlq/ping-pong/tags

(tag: 2.03)

Command used to start the cluster and set up and claim the persistent volume, which is **not** used here:
```
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
kubectl apply -f https://raw.githubusercontent.com/rvl-q/KuberParts/main/part1/e111/persistentvolume.yaml
kubectl apply -f https://raw.githubusercontent.com/rvl-q/KuberParts/main/part1/e111/persistentvolumeclaim.yaml
```
The used [yaml file](namespace.yaml) for the new namespace.
```
kind: Namespace
apiVersion: v1
metadata:
  name: exercises
  labels:
    name: exercises
```

The used [ingress.yaml file](https://github.com/rvl-q/hashapp/blob/652ea7ead4169cffa3f3d8c35bc605b7c5598dfc/manifests/ingress.yaml) for log-otput. This allows coexistence with the Todo Projec (which also uses `/` path), by host rule.
```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: log-output-ingress
  namespace: exercises
spec:
  rules:
  - host: log.localhost
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: log-output-svc
            port:
              number: 2345
```

The rest of the manifest files.

[log-output](./lo-manifests/)

[ping-pong](./pp-manifests/)


Command used to deploy the application(s):
```
kubectl apply -f manifests/
```
logs:
[here](./e203.txt).
