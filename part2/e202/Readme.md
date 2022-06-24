# Exercise 2.02: Project v1.0

Separating the backend.

Project source: https://version.aalto.fi/gitlab/rvl/project/-/tree/main
(based on: https://github.com/avihavai/wsd-walking-skeleton by avihavai)

[Public checkout of the previous version here at end of part 1.](../../part1/e113/Project.v0.7/)

Latest version will be publlishes one way or another before end of part 2.

Docker image:
https://hub.docker.com/r/rvlq/project/tags
(tag: v1.0)

Command used to start the cluster and set up and claim the persistent volume:
```
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
kubectl apply -f https://raw.githubusercontent.com/rvl-q/KuberParts/main/part1/e111/persistentvolume.yaml
kubectl apply -f https://raw.githubusercontent.com/rvl-q/KuberParts/main/part1/e111/persistentvolumeclaim.yaml
```


Command used to deploy the application(s):
```
kubectl apply -f manifests/
```

logs:
[here](./e201.txt).
