# Exercise 4.04: Project v1.8

Analysis template:
```
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: cpu-rate
spec:
  metrics:
  - name: cpu-rate
    initialDelay: 2m
    # successCondition: result < 0.002 # this did fail
    successCondition: result < 0.02
    provider:
      prometheus:
        address: http://kube-prometheus-stack-1657-prometheus.prometheus.svc.cluster.local:9090 # DNS name for my Prometheus, find yours with kubectl describe svc ...
        query: |
          scalar(
            sum(rate(container_cpu_usage_seconds_total{namespace="project"}[10m]))
          )
```

![Screenshot of Prometheus analysis graph](Screenshot%20from%202022-08-18%2017-26-50.png)

Backend rollout:
```
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: proj01-dep
  namespace: project
spec:
  replicas: 4
  selector:
    matchLabels:
      app: proj01
  strategy:
    canary:
      steps:
      - setWeight: 25
      - pause:
          duration: 5m
      - setWeight: 50
      - pause:
          duration: 5m
      - setWeight: 75
      - pause:
          duration: 5m
      - analysis:
          templates:
          - templateName: cpu-rate
  template:
    metadata:
      labels:
        app: proj01
    spec:
      volumes:
        - name: shared-share
          persistentVolumeClaim:
            claimName: share-claim
      containers:
        - name: proj01
          imagePullPolicy: IfNotPresent
          image: IMAGE_PLACEHOLDER
          readinessProbe:
            initialDelaySeconds: 5 # Initial delay until the readiness is tested
            periodSeconds: 10 # How often to test
            httpGet:
               path: /healthz
               port: 9999
          livenessProbe:
            initialDelaySeconds: 20 # Initial delay until the readiness is tested
            periodSeconds: 10 # How often to test
            httpGet:
               path: /healthz
               port: 9999
            failureThreshold: 5
            # Override pod-level terminationGracePeriodSeconds #
            terminationGracePeriodSeconds: 60
          envFrom:
            - secretRef:
                name: pg-secrets
          volumeMounts: # Mount volume
          - name: shared-share
            mountPath: /app/images
          resources:
            requests:
              memory: "64Mi"
              cpu: "20m"
            limits:
              memory: "128Mi"
              cpu: "100m"
```

Frontend rollout:
```
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: proj02-dep
  namespace: project
spec:
  replicas: 4
  selector:
    matchLabels:
      app: proj02
  strategy:
      canary:
        steps:
        - setWeight: 25
        - pause:
            duration: 30s
        - setWeight: 50
        - pause:
            duration: 30s
        - analysis:
            templates:
            - templateName: cpu-rate
  template:
    metadata:
      labels:
        app: proj02
    spec:
      containers:
        - name: proj02
          imagePullPolicy: Always
          image: IMAGE_PLACEHOLDER
          readinessProbe:
            initialDelaySeconds: 5 # Initial delay until the readiness is tested
            periodSeconds: 10 # How often to test
            httpGet:
               path: /
               port: 80

          resources:
            limits:
              memory: "256Mi"
              cpu: "500m"
```

[Possible logs](e404.txt)
