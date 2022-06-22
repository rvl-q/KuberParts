# Exercise 1.12: Project v0.6

Adding persistent volume to project.

Project source: https://version.aalto.fi/gitlab/rvl/project/-/tree/main
(based on: https://github.com/avihavai/wsd-walking-skeleton by avihavai)

Docker image:
https://hub.docker.com/r/rvlq/project/tags
(tag: v0.6)

Command used to start the cluster and set up and claim the persistent volume:
```
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
kubectl apply -f https://raw.githubusercontent.com/rvl-q/KuberParts/main/part1/e111/persistentvolume.yaml
kubectl apply -f https://raw.githubusercontent.com/rvl-q/KuberParts/main/part1/e111/persistentvolumeclaim.yaml
```

The [imageController.js file](imageController.js) used to serve and update the image:
<details>
  <summary>Click to expand!</summary>

```
import { dayOfYear } from "https://deno.land/std@0.144.0/datetime/mod.ts";
import { writableStreamFromWriter } from "https://deno.land/std@0.144.0/streams/mod.ts";

const responseDetails = {
  headers: { "Content-Type": "image/jpg" },
};

const IMAGE_PATH = "./images/image.jpg";
const MAXAGE = 86400000
// const MAXAGE = 100000 // for faster debugging

const serveImage = async (request) => {
  const file = await Deno.stat(IMAGE_PATH);
  if (file.isFile) {
    let file_time = file.mtime;
    let now = new Date();
    let diff_time = now - file_time;
    let day_number_file = dayOfYear(file_time);
    let day_number_now = dayOfYear(now);
    // console.log(dn, dnn, dt);
    if (day_number_file != day_number_now || diff_time > MAXAGE) {
      console.log("debug, we are here!");
      const fileResponse = await fetch("https://picsum.photos/800");
      // download
      if (fileResponse.body) {
        const file = await Deno.open(IMAGE_PATH, {
          write: true,
          create: true,
        });
        const writableStream = writableStreamFromWriter(file);
        await fileResponse.body.pipeTo(writableStream);
      }
    }
  } else {
    console.log("no file! loading a new one...");
    const fileResponse = await fetch("https://picsum.photos/800");
    // download
    if (fileResponse.body) {
      const file = await Deno.open(IMAGE_PATH, {
        write: true,
        create: true,
      });
      const writableStream = writableStreamFromWriter(file);
      await fileResponse.body.pipeTo(writableStream);
    }
  }

  const img = await Deno.readFile(IMAGE_PATH);
  return new Response(img, responseDetails);
};

export { serveImage };
```
</details>


Command used to deploy the application(s):
```
kubectl apply -f manifests/
```
[The manifests folder.](./manifests/)

logs:
[here](./e112.txt).
