# Exercise 5.01: DIY CRD & Controller

dummysitex.yaml:
```
apiVersion: stable.dwk/v1
kind: DummySite
metadata:
  name: dummysite-gen
spec:
  website_url: https://example.com/
  # website_url: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.25/
  image: rvlq/dummy:latest
```

dummysite.yaml:
```
apiVersion: stable.dwk/v1
kind: DummySite
metadata:
  name: dummysite-gen
spec:
  # website_url: https://example.com/
  website_url: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.25/
  image: rvlq/dummy:latest
```

![Screenshot example.com](ScreenshoExampleCom.png)
Web page scraping not fully implemented, as focus was on the custom controller. Works OK for `example.com`, but below css and scripts are missing.
![Screenshot](Screensho.png)

## Test steps

### Quote
"Test that creating a DummySite resource with website_url "https://example.com/" should create a copy of the website.

The controller doesn't have to work perfectly in all circumstances. The following workflow should succeed: 1. apply role, account and binding. 2. apply deployment. 3. apply DummySite"
```
$ kubectl apply -k manifests
customresourcedefinition.apiextensions.k8s.io/dummysites.stable.dwk created
serviceaccount/dummysite-controller-account unchanged
clusterrole.rbac.authorization.k8s.io/dummysite-controller-role created
clusterrolebinding.rbac.authorization.k8s.io/dummysite-rolebinding created


$ kubectl apply -f manifests/deployment.yaml 
deployment.apps/dummysite-controller-dep created

$ kubectl apply -f manifests/dummysitex.yaml 
dummysite.stable.dwk/dummysite-gen created
```


[Possible logs](e501.txt)
