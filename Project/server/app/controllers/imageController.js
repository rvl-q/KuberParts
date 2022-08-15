import { dayOfYear } from "https://deno.land/std@0.144.0/datetime/mod.ts";
import { writableStreamFromWriter } from "https://deno.land/std@0.144.0/streams/mod.ts";
import {existsSync} from "https://deno.land/std/fs/mod.ts";

// const responseDetails = {
//   headers: { "Content-Type": "image/jpg" },
// };

const IMAGE_URL = "https://picsum.photos/800";
const IMAGE_PATH = "./images/image.jpg";
const MAXAGE = 86400000
// const MAXAGE = 100000 // for faster debugging

const pathFound = existsSync(IMAGE_PATH)
console.log('file present:', pathFound)
if (!pathFound) {
  await Deno.create(IMAGE_PATH);
}

const serveImage = async () => {
  console.log("serving image...");
  const file = await Deno.stat(IMAGE_PATH);
  console.log("...serving image..2");
  if (file.isFile) {
    console.log("...serving image..3");
    const file_time = file.mtime;
    const now = new Date();
    const diff_time = now - file_time;
    const day_number_file = dayOfYear(file_time);
    const day_number_now = dayOfYear(now);
    // console.log(dn, dnn, dt);
    if (file.size===0 | day_number_file != day_number_now || diff_time > MAXAGE) {
      // console.log("debug, we are here! Updating image...");
      const fileResponse = await fetch(IMAGE_URL);
      // const fileResponse = await fetch("https://picsum.photos/400");
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
    const fileResponse = await fetch(IMAGE_URL);
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

  // const img = await Deno.readFile(IMAGE_PATH);
  // return new Response(img, responseDetails);
};

export { serveImage };
