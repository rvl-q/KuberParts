import { serve } from "https://deno.land/std@0.120.0/http/server.ts";
import { Client } from "https://deno.land/x/postgres@v0.14.3/mod.ts";

const PORT = Deno.env.get("PORT");
const PASSWORD = Deno.env.get("POSTGRES_PASSWORD");
console.log(PASSWORD.length)

const client = new Client({
  hostname: "postgres-ss-0",
  database: "postgres",
  user: "posegres",
  password: PASSWORD,
  port: 5432,
});

await client.connect();
const result = await client.queryArray("SELECT * FROM names;");
await client.end();

console.log(result.rows);

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

