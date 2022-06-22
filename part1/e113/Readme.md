# Exercise 1.13: Project v0.7

Preparing project for coming parts.

![screenshot](Screenshot%20from%202022-06-22%2014-43-29.png)

Project source: https://version.aalto.fi/gitlab/rvl/project/-/tree/main
(based on: https://github.com/avihavai/wsd-walking-skeleton by avihavai)

[Public checkout of the latest version here at end of part 1.](Project.v0.7/)

Docker image:
https://hub.docker.com/r/rvlq/project/tags
(tag: v0.7)

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
[here](./e113.txt).
