import { serve } from "https://deno.land/std@0.120.0/http/server.ts";

const PORT = Deno.env.get("PORT");

let _ping_num = 0
// Deno.writeTextFile("./shared/pongs.txt", _ping_num);

const handleRequest = (request) => {
  console.log(`Request to ${request.url}`);
  const url = new URL(request.url);
  if (url.pathname === "/pingpong" && request.method === "GET") {
    _ping_num += 1;
    // Deno.writeTextFile("./shared/pongs.txt", _ping_num);
    return new Response("pong " + _ping_num);
  }
   else if (url.pathname === "/pongs" && request.method === "GET"){
    return new Response(_ping_num);
  }
};

console.log("Server started in port " + PORT);
serve(handleRequest, { port: parseInt(PORT) });

