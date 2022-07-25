# Exercise 3.08: Project v1.5

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gke-project-dep
  namespace: project
...
          resources:
            limits:
              memory: "128Mi"
              cpu: "99m"
```

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gke-project-f-dep
  namespace: project
...
          resources:
            requests:
              memory: "64Mi"
              cpu: "25m"
            limits:
              memory: "256Mi"
              cpu: "250m"
```


[Possible logs](e308.txt)