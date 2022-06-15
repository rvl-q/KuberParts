import { serve } from "https://deno.land/std@0.120.0/http/server.ts";

const PORT = Deno.env.get("PORT");

const handleRequest = (request) => {
  console.log(`Request to ${request.url}`);
  return new Response("Hello world from port: " + PORT);
};

console.log("Server started in port " + PORT);
serve(handleRequest, { port: parseInt(PORT) });
