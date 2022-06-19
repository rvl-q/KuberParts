import { serve } from "https://deno.land/std@0.120.0/http/server.ts";
import { configure } from "https://deno.land/x/eta@v1.12.3/mod.ts";


const PORT = Deno.env.get("PORT");

let _ping_num = -1

const handleRequest = (request) => {
  console.log(`Request to ${request.url}`);
  const url = new URL(request.url);
  if (url.pathname === "/pingpong" && request.method === "GET") {
    _ping_num += 1;
    return new Response("pong " + _ping_num);
  } else {
    return new Response("Not found", { status: 404 });
  }
};

console.log("Server started in port " + PORT);
serve(handleRequest, { port: parseInt(PORT) });

