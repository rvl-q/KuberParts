# Exercise 2.07: Stateful applications

Application sources:

[ping-pong](../../ping-pong/)

[log-output](https://github.com/rvl-q/hashapp)

Docker images:

https://hub.docker.com/r/rvlq/log-output/tags

(tag: 2.06)

https://hub.docker.com/r/rvlq/ping-pong/tags

(tag: 2.07)

Command used to start the cluster:
```
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
```

The used [yaml file](./pg-service.yaml) for the Postgres database service.
```
apiVersion: v1
kind: Service
metadata:
  name: postgres-svc
  namespace: exercises
  labels:
    app: postgres
spec:
  ports:
  - port: 5432
    name: web
  clusterIP: None # "headless"
  selector:
    app: postgres
```

The used [stateful set yaml file](./pg-statefulset.yaml) for the Postgres database.
```
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres-ss
  namespace: exercises
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:14.0
          ports:
            - name: postgres
              containerPort: 5432
          envFrom:
            - secretRef:
                name: pg-secrets
          # env:
          # - name: POSTGRES_PASSWORD
          #   value: "example"
          volumeMounts:
            - name: data
              mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes: ["ReadWriteOnce"]
        storageClassName: local-path
        resources:
          requests:
            storage: 100Mi
```

Command used to deploy the ping-pong application and database, (when the exercise namespace is already previously set up):
```
sops --decrypt secret.enc.yaml | kubectl apply -f -
kubectl apply -f manifests/
```
[The encrypted secret.enc.yaml file](secret.enc.yaml)


Log-output deployment as in previos exercise.

logs:
[here](./e207.txt).
