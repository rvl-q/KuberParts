# Exercise 5.05: Deploy to Serverless

Setup cluster:
```
k3d cluster create k3s-505 --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2 --k3s-arg "--disable=traefik@server:0"
```
Installing Knative:
```
kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.0.0/serving-crds.yaml

kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.0.0/serving-core.yaml
```

Contour:
```
kubectl apply -f https://github.com/knative/net-contour/releases/download/knative-v1.0.0/contour.yaml \
                -f https://github.com/knative/net-contour/releases/download/knative-v1.0.0/net-contour.yaml

kubectl patch configmap/config-network \
  --namespace knative-serving \
  --type merge \
  --patch '{"data":{"ingress-class":"contour.ingress.networking.knative.dev"}}'
```

Ping-pong:
```
$ kubectl apply -k manifests/
  ...
  
$ kubectl get revisions,routes
NAME                                            CONFIG NAME   K8S SERVICE NAME   GENERATION   READY   REASON   ACTUAL REPLICAS   DESIRED REPLICAS
revision.serving.knative.dev/ping-pong-dwk-v0   ping-pong                        1            True             0                 0

NAME                                  URL                                      READY   REASON
route.serving.knative.dev/ping-pong   http://ping-pong.exercises.example.com   True    

$ curl -H "Host: ping-pong.exercises.example.com" http://localhost:8081/pingpong
pong 13
```

[Possible logs](e505.txt)
