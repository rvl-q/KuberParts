# Exercise 2.01: Connecting pods

Application sources:

[log-output](https://github.com/rvl-q/hashapp)

[ping-pong](../../ping-pong/)

Docker images:

https://hub.docker.com/r/rvlq/log-output/tags

https://hub.docker.com/r/rvlq/ping-pong/tags

(tag: 2.01)

Command used to start the cluster and set up and claim the persistent volume, which is **not** used here:
```
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
kubectl apply -f https://raw.githubusercontent.com/rvl-q/KuberParts/main/part1/e111/persistentvolume.yaml
kubectl apply -f https://raw.githubusercontent.com/rvl-q/KuberParts/main/part1/e111/persistentvolumeclaim.yaml
```
The used deployment.yaml file for ping-pong.
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ping-pong-dep
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ping-pong
  template:
    metadata:
      labels:
        app: ping-pong
    spec:
      # volumes:
      #   - name: shared-share
      #     persistentVolumeClaim:
      #       claimName: share-claim
      containers:
        - name: ping-pong
          image: rvlq/ping-pong:2.01
          # volumeMounts:
          # - name: shared-share
          #   mountPath: /app/shared
          resources:
              limits:
                memory: "64Mi"
                cpu: "100m"
```

The used deployment.yaml file for log-otput.
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: log-output-dep
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
      # volumes:
      #   - name: shared-share
      #     persistentVolumeClaim:
      #       claimName: share-claim
      containers:
        - name: log-output
          image: rvlq/log-output:2.01
          # volumeMounts: # Mount volume
          # - name: shared-share
          #   mountPath: /code/app/shared
          resources:
            limits:
              memory: "512Mi"
              cpu: "500m"
```

The used ingress.yaml file.
```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: dwk-material-ingress
spec:
  rules:
  - http:
      paths:
      - path: /pingpong
        pathType: Prefix
        backend:
          service:
            name: ping-pong-svc
            port:
              number: 1234              
      - path: /
        pathType: Prefix
        backend:
          service:
            name: log-output-svc
            port:
              number: 2345
```

Service yaml files unchanged since last version.

Command used to deploy the application(s):
```
kubectl apply -f manifests/
```
logs:
[here](./e201.txt).
