import { Pool } from "https://deno.land/x/postgres@v0.14.3/mod.ts";
import { doze } from 'https://deno.land/x/doze/mod.ts';


const POSTGRES_USERNAME = Deno.env.get("POSTGRES_USERNAME");
const POSTGRES_DATABASE = Deno.env.get("POSTGRES_DATABASE");
const POSTGRES_PASSWORD = Deno.env.get("POSTGRES_PASSWORD");

const CONCURRENT_CONNECTIONS = 2;

let connectionPool = new Pool({
  hostname: "postgres-svc",
  database: POSTGRES_DATABASE,
  user: POSTGRES_USERNAME,
  password: POSTGRES_PASSWORD,
  port: 5432,
}, CONCURRENT_CONNECTIONS);

console.log('connection pool:', connectionPool);

const executeQuery = async (query, ...args) => {
  const response = {};
  let client;

  try {

    console.log('...try connection pool:', connectionPool);
    console.log('connectionPool.connect:', connectionPool.connect);

    client = await connectionPool.connect();
    const result = await client.queryObject(query, ...args);
    if (result.rows) {
      response.rows = result.rows;
    }
  } catch (e) {
    console.log("connection error:\n",e);
    response.error = e;

    await doze(5);
    try{
      connectionPool = new Pool({
        hostname: "postgres-svc",
        database: POSTGRES_DATABASE,
        user: POSTGRES_USERNAME,
        password: POSTGRES_PASSWORD,
        port: 5432,
      }, CONCURRENT_CONNECTIONS);
    } catch(e){
      console.log("inner connection error:\n",e);
    }
    // connectionPool.end()
    console.log("after connection error");

  } finally {
    if (client) {
      try {
        await client.release();
      } catch (e) {
        console.log("Unable to release database connection.");
        console.log(e);
      }
    }
  }

  return response;
};

export { executeQuery };