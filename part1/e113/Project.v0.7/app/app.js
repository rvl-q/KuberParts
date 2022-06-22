import { serve } from "https://deno.land/std@0.120.0/http/server.ts";
import { configure } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import * as todoController from "./controllers/todoController.js";
import * as imageController from "./controllers/imageController.js";
import * as requestUtils from "./utils/requestUtils.js";

configure({
  views: `${Deno.cwd()}/views/`,
});

const PORT = Deno.env.get("PORT");

const handleRequest = (request) => {
  console.log(`Request to ${request.url}`);
  const url = new URL(request.url);
  // return new Response("Hello world from port: " + PORT);
  if (url.pathname === "/" && request.method === "GET") {
    // return await todoController.viewTodos(request); // syntax error?
    return todoController.viewTodos(request);
  } else if (url.pathname === "/images/image.jpg" && request.method === "GET"){
    return imageController.serveImage (request);
  } else if (request.method === "POST"){
    return requestUtils.redirectTo("/");
  }
};

console.log("Server started in port " + PORT);
serve(handleRequest, { port: parseInt(PORT) });

