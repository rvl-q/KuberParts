# Exercise 4.02: Project v1.7

The server probes:
```
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
```

The client probe:
```
          readinessProbe:
            initialDelaySeconds: 5 # Initial delay until the readiness is tested
            periodSeconds: 10 # How often to test
            httpGet:
               path: /
               port: 80
```
Nothing fancy here and no liveness, as nginx is used for the frontend.

[Possible logs](e402.txt)
