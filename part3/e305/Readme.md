# Exercise 3.05: Project v1.4.2

```
name: Delete namespace

on:
  delete:

env:
  PROJECT_ID: ${{ secrets.GKE_PROJECT }}
  GKE_CLUSTER: dwk-cluster
  GKE_ZONE: europe-north1-b
  IMAGE: gke-project

jobs:
  setup-build-publish-deploy:
    name: Reversed Setup, Build, Publish, and Deploy
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v0
        with:
          project_id: ${{ secrets.GKE_PROJECT }}
          service_account_key: ${{ secrets.GKE_SA_KEY }}
          export_default_credentials: true

      # - run: echo tearing down namespace ${{GITHUB_REF#refs/heads/}}
      - run: echo tearing down namespace "${{ github.event.ref }}"
      - run: echo tearing down namespace ${{ github.event.ref }}
      - run: echo tearing down namespace...
      - run: gcloud container clusters get-credentials "$GKE_CLUSTER" --zone "$GKE_ZONE"

      - name: De-Deploy
        run: kubectl delete namespace ${{ github.event.ref }} # not ${{GITHUB_REF#refs/heads/}}

        # kubectl create namespace ${GITHUB_REF#refs/heads/} || true
        # kubectl config set-context --current --namespace=${GITHUB_REF#refs/heads/}
        # kustomize edit set namespace ${GITHUB_REF#refs/heads/}
        # kustomize edit set image gcr.io/PROJECT_ID/IMAGE=gcr.io/$PROJECT_ID/$IMAGE:${GITHUB_REF#refs/heads/}-$GITHUB_SHA
        # kubectl apply -k .
        # kubectl rollout status deployment $IMAGE

```

https://github.com/rvl-q/KuberParts/actions/runs/2725348870

```
2022-07-23T23:32:18.649954490Z"Syncing iptables rules"
Info
2022-07-23T23:32:18.700041549ZService p304/gke-proj01-svc updated: 0 ports
Info
2022-07-23T23:32:18.716888310Z"SyncProxyRules complete" elapsed="66.779063ms"
Info
2022-07-23T23:32:18.716910694ZRemoving service port "p304/gke-proj01-svc"
Info
2022-07-23T23:32:18.716926652Z"Syncing iptables rules"
Info
2022-07-23T23:32:18.751634805ZService p304/gke-proj02-svc updated: 0 ports
Info
2022-07-23T23:32:18.797479075Z"SyncProxyRules complete" elapsed="80.525351ms"
Info
2022-07-23T23:32:28.797446228ZRemoving service port "p304/gke-proj02-svc"
Info
2022-07-23T23:32:28.797652463Z"Syncing iptables rules"
Info
2022-07-23T23:32:28.840424147Z"SyncProxyRules complete" elapsed="43.109893ms"
```

[Possible logs](e305.txt)