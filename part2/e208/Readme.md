# Exercise 2.08: Project v1.2

Creating a database and saving the todos there.

Project source: https://version.aalto.fi/gitlab/rvl/project/-/tree/main

[Public checkout of the previous version here at end of part 1.](../../part1/e113/Project.v0.7/)

Latest version will be publlishes one way or another before end of part 2.

The used [yaml file](./manifests/persistent/namespace.yaml) for the new namespace.
```
kind: Namespace
apiVersion: v1
metadata:
  name: project
  labels:
    name: project
```

Command(s) used to setup namespace, persistent volume and deploy the application(s):
```
kubectl apply -f persistent/
kubectl apply -f manifests/
```

[The manifest folders are here.](./manifests/)


Docker images (tag: v1.1):

Back: https://hub.docker.com/r/rvlq/project/tags

Front: https://hub.docker.com/r/rvlq/proj-front/tags

Command used to start the cluster:
```
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
```


logs:
[here](./e208.txt).
