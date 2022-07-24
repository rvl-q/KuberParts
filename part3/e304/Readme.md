# Exercise 3.04: Project v1.4.1

```
name: Release application

on:
  push:
    branches-ignore:
      - 'main'
    paths:
      - 'Project/**'  
      - '.github/workflows/branch.yaml'  

env:
  PROJECT_ID: ${{ secrets.GKE_PROJECT }}
  SOPS_AGE_KEY: ${{ secrets.AGE_SECRET_KEY }} # export SOPS_AGE_KEY ${{ secrets.AGE_SECRET_KEY }}
  GKE_CLUSTER: dwk-cluster
  GKE_ZONE: europe-north1-b
  IMAGE: gke-project

jobs:
  setup-build-publish-deploy:
    name: Setup, Build, Publish, and Deploy
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

      # Configure Docker to use the gcloud command-line tool as a credential
      # helper for authentication
      - run: |-
          gcloud --quiet auth configure-docker

      # # Dry run test Sops without GKE project running
      # # DONE! - remove after test - OK!
      # # We need sops
      # - name: Install sops
      #   uses: mdgreenwald/mozilla-sops-action@v1.2.0

      # - run: |-
      #     echo testing sops decryption, before:
      #     cat ./Project/manifests/secret.enc.yaml|wc
      #     sops -d -i Project/manifests/secret.enc.yaml
      #     echo testing sops decryption, after:
      #     cat ./Project/manifests/secret.enc.yaml|wc
        # testing sops decryption, before:
        #      29      54    1595
        # testing sops decryption, after:
        #       9      16     216

      # Get the GKE credentials so we can deploy to the cluster
      - run: |-
          gcloud container clusters get-credentials "$GKE_CLUSTER" --zone "$GKE_ZONE"
      # Build the Docker image
      - name: Build
        run: |-
          docker build ./Project/client \
            --tag "gcr.io/$PROJECT_ID/$IMAGE-front:${GITHUB_REF#refs/heads/}-$GITHUB_SHA"
          docker build ./Project/daily-todos \
            --tag "gcr.io/$PROJECT_ID/$IMAGE-cron:${GITHUB_REF#refs/heads/}-$GITHUB_SHA"
          docker build ./Project/server/app \
            --tag "gcr.io/$PROJECT_ID/$IMAGE-back:${GITHUB_REF#refs/heads/}-$GITHUB_SHA"

      # Push the Docker image to Google Container Registry
      - name: Publish
        run: |-
          docker push "gcr.io/$PROJECT_ID/$IMAGE-front:${GITHUB_REF#refs/heads/}-$GITHUB_SHA"
          docker push "gcr.io/$PROJECT_ID/$IMAGE-back:${GITHUB_REF#refs/heads/}-$GITHUB_SHA"
          docker push "gcr.io/$PROJECT_ID/$IMAGE-cron:${GITHUB_REF#refs/heads/}-$GITHUB_SHA"

      # We need sops
      - name: Install sops
        uses: mdgreenwald/mozilla-sops-action@v1.2.0

      # Decrypt...
        # echo "${{ secrets.AGE_SECRET_KEY }}" > key.txt
        # export SOPS_AGE_KEY_FILE=key.txt
        # export SOPS_AGE_KEY ${{ secrets.AGE_SECRET_KEY }}
      - name: Decrypt secret yaml
        run: |-
          sops -d -i Project/manifests/secret.enc.yaml

      # Set up kustomize
      - name: Set up Kustomize
        uses: imranismail/setup-kustomize@v1

      # Deploy the Docker image to the GKE cluster
      # - name: Deploy
      #   run: |-
      #     kustomize edit set image gcr.io/PROJECT_ID/IMAGE=gcr.io/$PROJECT_ID/$IMAGE:${GITHUB_REF#refs/heads/}-$GITHUB_SHA
      #     kustomize build . | kubectl apply -f -
      #     kubectl rollout status deployment $IMAGE
      #     kubectl get services -o wide

      - name: Deploy
        run: |-
          cd Project
          kubectl create namespace ${GITHUB_REF#refs/heads/} || true
          kubectl config set-context --current --namespace=${GITHUB_REF#refs/heads/}
          kustomize edit set namespace ${GITHUB_REF#refs/heads/}
          kustomize edit set image BACK_IMG=gcr.io/$PROJECT_ID/$IMAGE-back:${GITHUB_REF#refs/heads/}-$GITHUB_SHA
          kustomize edit set image CRON_IMG=gcr.io/$PROJECT_ID/$IMAGE-cron:${GITHUB_REF#refs/heads/}-$GITHUB_SHA
          kustomize edit set image FRONT_IMG=gcr.io/$PROJECT_ID/$IMAGE-front:${GITHUB_REF#refs/heads/}-$GITHUB_SHA
          kubectl apply -k .
          kubectl rollout status deployment $IMAGE-dep
          kubectl rollout status deployment $IMAGE-f-dep
          kubectl get services -o wide
```

https://github.com/rvl-q/KuberParts/actions/runs/2725311862

```
2022-07-23T23:18:37.025708573Z	Service p304/gke-proj01-svc updated: 1 ports
2022-07-23T23:18:37.025996179Z	Adding new service port "p304/gke-proj01-svc" at 10.32.15.183:80/TCP
2022-07-23T23:18:37.026047995Z	"Syncing iptables rules"
2022-07-23T23:18:37.063988361Z	"SyncProxyRules complete" elapsed="38.168234ms"
2022-07-23T23:18:37.163626578Z	"Syncing iptables rules"
2022-07-23T23:18:37.203974159Z	"SyncProxyRules complete" elapsed="40.452331ms"
2022-07-23T23:18:37.398838497Z	Service p304/gke-proj02-svc updated: 1 ports
2022-07-23T23:18:39.982993781Z	Service p304/gke-proj02-svc updated: 1 ports
2022-07-23T23:18:47.205106272Z	Adding new service port "p304/gke-proj02-svc" at 10.32.10.163:80/TCP
2022-07-23T23:18:47.205313090Z	"Syncing iptables rules"
2022-07-23T23:18:47.257016830Z	"SyncProxyRules complete" elapsed="51.936429ms"
2022-07-23T23:18:57.257647734Z	"Syncing iptables rules"
2022-07-23T23:18:57.297186873Z	"SyncProxyRules complete" elapsed="39.859561ms"
```

[Possible logs](e304.txt)