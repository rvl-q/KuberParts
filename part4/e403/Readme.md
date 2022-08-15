# Exercise 4.03: Prometheus

Write a query that shows the number of pods created by StatefulSets in "prometheus" namespace. For the above setup the "Value" should be 2 different pods.

`kube_pod_info` -> many "rows"


filter1

`kube_pod_info{namespace="prometheus"}` -> 8 "rows"


filter1+2

`kube_pod_info{namespace="prometheus", created_by_kind="StatefulSet"}` -> 2 "rows"

`sum(kube_pod_info{namespace="prometheus", created_by_kind="StatefulSet"})` -> `{}  2`

`scalar(sum(kube_pod_info{namespace="prometheus", created_by_kind="StatefulSet"}))` ->
`scalar  2`


[Possible logs](e403.txt)
