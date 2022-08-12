import { serve } from "https://deno.land/std@0.120.0/http/server.ts";
import { Client } from "https://deno.land/x/postgres@v0.14.3/mod.ts";
import {deadline} from "https://deno.land/std/async/mod.ts";
import { DeadlineError } from "https://deno.land/std@0.134.0/async/deadline.ts";
import { doze } from 'https://deno.land/x/doze/mod.ts';
// import { INTERNAL_SERVER_ERROR } from "https://deno.land/x/status@0.1.0/mod.ts";
import { Status } from "https://deno.land/std/http/http_status.ts";//Status.Ok

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

let db_ready = false;
let db_present = false;

// // test query, with "manually" created table
// await client.connect();
// const result = await client.queryArray("SELECT * FROM names;");
// await client.end();
// console.log(result.rows);


const getNumPings = async () => {
  if (db_ready) {
    await client.connect();
    const result = await client.queryArray(
      `SELECT value FROM counters WHERE id=1 ;`
    );
    await client.end();
    
    return result.rows[0][0];
  } else {
    return -1;
}
};

const incPings = async () => {
  await client.connect();
  // const result = await client.queryArray(
  await client.queryArray(
      `UPDATE counters 
      SET value = value+1 
    WHERE id = 1`
  );
  await client.end();
  // console.log('result', result)
  return;
};


const handleRequest = async (request) => {
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
  // needed for GKE Ingress health check
  else if (url.pathname === "/" && request.method === "GET"){
    return new Response('Dummy 200 OK');
  }
  else if (url.pathname === "/healthz" && request.method === "GET"){
    if (db_ready) {
      console.log('200')
      return new Response('Dummy 200 OK');
    } else {
      console.log('500', Status.InternalServerError)
      return new Response(
          null, { status: Status.InternalServerError }
      );
    }
  }
  // else {
  //   return new Response('400');
  // }
};

console.log("Server started in port " + PORT);
serve(handleRequest, { port: parseInt(PORT) });


// await client.connect();
while (!db_present){
  try {
    const p=client.connect(); //Get promise
    const _d=await deadline(p, 10000); //promise ok, or timeout
    db_present = true;
  } catch(e) {
    if(e instanceof DeadlineError){
        //handle timeout
        console.log('db connection timeout');
        await doze(5);
      }
    else {
        //handle other errors
        console.log('db connection other error')
        await doze(5);
      }
  }
}

const result0 = await client.queryArray(
  `CREATE TABLE IF NOT EXISTS counters(
    id SERIAL PRIMARY KEY,
    name TEXT,
    value INT
  );
  INSERT INTO counters (id, name, value)
    VALUES (1, 'p', 0 ) ON CONFLICT DO NOTHING;
  `
);
await client.end();
console.log('table created', result0.rows);


await client.connect();
const result3 = await client.queryArray(
  `SELECT * FROM counters WHERE id=1 ;`
);
await client.end();
// console.log('initial pings', result3, result3 && result3.rows);

// UPDATE counters SET value = ISNULL(value, 0) WHERE id = 1
let _ping_num = result3.rows[0][2];
// Deno.writeTextFile("./shared/pongs.txt", _ping_num);
console.log('inital pings  from database are:', _ping_num)
db_ready = true;
