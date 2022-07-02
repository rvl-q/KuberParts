import { serve } from "https://deno.land/std@0.120.0/http/server.ts";
import { Client } from "https://deno.land/x/postgres@v0.14.3/mod.ts";

const PORT = Deno.env.get("PORT");
const PASSWORD = Deno.env.get("POSTGRES_PASSWORD");
console.log(PASSWORD.length)
console.log('Got PASSWORD')

const client = new Client({
  hostname: "postgres-svc",
  database: "postgres",
  user: "postgres",
  password: PASSWORD,
  port: 5432,
});

// // test query, with "manually" created table
// await client.connect();
// const result = await client.queryArray("SELECT * FROM names;");
// await client.end();
// console.log(result.rows);

await client.connect();
const result0 = await client.queryArray(
  `CREATE TABLE IF NOT EXISTS counters(
    id SERIAL PRIMARY KEY,
    name TEXT,
    value INT
  );`
);
await client.end();
console.log('table created', result0.rows);

await client.connect();
const result1 = await client.queryArray(
  `SELECT value FROM counters WHERE id=1 ;`
);
await client.end();
// console.log('initial pings', result1, result1 && result1.rows);

if (result1.rowCount === 0){
  await client.connect();
  const result2 = await client.queryArray(
    `INSERT INTO counters (name, value) VALUES ('p', 0);`
  );
  await client.end();
  console.log('initialized pings', result2, result2 && result2.rows);
}

await client.connect();
const result3 = await client.queryArray(
  `SELECT * FROM counters WHERE id=1 ;`
);
await client.end();
// console.log('initial pings', result3, result3 && result3.rows);

// UPDATE counters SET value = ISNULL(value, 0) WHERE id = 1
let _ping_num = result3.rows[0][2];
// Deno.writeTextFile("./shared/pongs.txt", _ping_num);
console.log('inital pins are:', _ping_num)

const getNumPings = async () => {
  await client.connect();
  const result = await client.queryArray(
    `SELECT value FROM counters WHERE id=1 ;`
  );
  await client.end();
  
  return result.rows[0][0];
};

const incPings = async () => {
  await client.connect();
  const result = await client.queryArray(
    `UPDATE counters SET value = ISNULL(value, 0)+1 WHERE id = 1`
  );
  await client.end();
  console.log('result', result)
  return;
};

// const handleRequest = (request) => {
//   console.log(`Request to ${request.url}`);
//   const url = new URL(request.url);
//   if (url.pathname === "/pingpong" && request.method === "GET") {
//     _ping_num += 1;
//     // Deno.writeTextFile("./shared/pongs.txt", _ping_num);
//     return new Response("pong " + _ping_num);
//   }
//    else if (url.pathname === "/pongs" && request.method === "GET"){
//     return new Response(_ping_num);
//   }
// };

const handleRequest = (request) => {
  console.log(`Request to ${request.url}`);
  const url = new URL(request.url);
  if (url.pathname === "/pingpong" && request.method === "GET") {
    await incPings();
    _ping_num = await getNumPings();
    return new Response("pong " + _ping_num);
  }
   else if (url.pathname === "/pongs" && request.method === "GET"){
    _ping_num = await getNumPings();
    return new Response(_ping_num);
  }
};

console.log("Server started in port " + PORT);
serve(handleRequest, { port: parseInt(PORT) });

