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
    //   const fileResponse = await fetch("https://picsum.photos/400");
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
