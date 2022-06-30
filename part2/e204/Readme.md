# Exercise 2.04: Project v1.1

Adding namespace.

Project source: https://version.aalto.fi/gitlab/rvl/project/-/tree/main

[Public checkout of the previous version here at end of part 1.](../../part1/e113/Project.v0.7/)

Latest version will be publlishes one way or another before end of part 2.

The used [yaml file](namespace.yaml) for the new namespace.
```
kind: Namespace
apiVersion: v1
metadata:
  name: project
  labels:
    name: project
```

Command(s) used to deploy the application(s):
```
kubectl apply -f namespace.yaml
kubectl apply -f manifests/
```

[The rest of the manifest files are here.](./manifests/)


Docker images (tag: v1.1):

Back: https://hub.docker.com/r/rvlq/project/tags

Front: https://hub.docker.com/r/rvlq/proj-front/tags

Command used to start the cluster and set up and claim the persistent volume:
```
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
kubectl apply -f https://raw.githubusercontent.com/rvl-q/KuberParts/main/part1/e111/persistentvolume.yaml
kubectl apply -f https://raw.githubusercontent.com/rvl-q/KuberParts/main/part1/e111/persistentvolumeclaim.yaml
```


logs:
[here](./e204.txt).
