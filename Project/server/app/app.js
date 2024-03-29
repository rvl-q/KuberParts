// import { serve } from "https://deno.land/std@0.120.0/http/server.ts";
import { Application, Router } from "https://deno.land/x/oak@v10.1.0/mod.ts";
// import { configure } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import * as todoController from "./controllers/todoController.js";
import * as imageController from "./controllers/imageController.js";
// import * as requestUtils from "./utils/requestUtils.js";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

// import * as nats from "https://deno.land/x/nats/src/mod.ts";

// import the connect function
import { connect, StringCodec } from "https://deno.land/x/nats/src/mod.ts";

// const HOSTNAME = process.env.HOSTNAME
const HOSTNAME = Deno.env.get("HOSTNAME");

// to create a connection to a nats-server:
console.log('before nats')
const nc = await connect({ servers: "nats://my-nats.default:4222" });
console.log('beafter nats', nc)

// create a codec
const sc = StringCodec();

// todo_status
nc.publish("todo_status", sc.encode(`Starting backend server! ${HOSTNAME}`));

const app = new Application();
const router = new Router();
const PORT = Deno.env.get("PORT");

const IMAGE_PATH = "./images/image.jpg";

const root = ({ request, response }) => {
  console.log("Method", request.method);
  // response.body = await todoController.viewTodos({ request });
  response.body = "OK";
};

const check = async ({ response }) => {
  // console.log("Health check");
  response.status = await todoController.dbAlive();
  // response.status = 200;
  response.body = "";
};

const getTodos = async ({ request, response }) => {
  const resp_l = await todoController.listTodos({ request, response });
  response.body = resp_l;
};

const getTodo = async ({ params, response }) => {
  const resp_l = await todoController.getTodo({ params, response });
  // response.body = resp_l;
  console.log(resp_l)
};

const putTodo = async ({ params, response }) => {
  console.log("before inner PUT");
  const controllerResponse = await todoController.putTodo({ params, response });
  nc.publish("todo_status", sc.encode("Todo mark as done:\n"+JSON.stringify(controllerResponse,null,2)));
};

const delTodo = async ({ params, response }) => {
  const controllerResponse = await todoController.delTodo({ params, response });
  nc.publish("todo_status", sc.encode("Todo deletion requested:\n"+JSON.stringify(controllerResponse,null,2)));
};

  const newTodo = async ({ context, request, response }) => {
  console.log("before new todo");
  const controllerResponse = await todoController.newTodo({ context, request, response });
  console.log(JSON.stringify(controllerResponse,null,2))
  nc.publish("todo_status", sc.encode("Received new todo:\n"+JSON.stringify(controllerResponse,null,2)));
  console.log("after new todo");
};

const getImage = async ({ request, response }) => {
  // console.log("Method", request.method);
  await imageController.serveImage({ request });
  // console.log("image file should be ready by now");

  const imageBuf = await Deno.readFile(IMAGE_PATH);
  response.body = imageBuf;
  response.headers.set("Content-Type", "image/jpg");
};

console.log("Server started in port " + PORT);
todoController.initTodoTable();

router.get("/", root);
router.get("/images/image.jpg", getImage);
router.get("/todos", getTodos);
router.get("/todos/:id", getTodo);
router.put("/todos/:id", putTodo);
router.delete("/todos/:id", delTodo);
router.post("/todos", newTodo);
router.get("/healthz", check);

// for local testing before they share the same port
app.use(oakCors());

app.use(router.routes());

app.listen({ port: parseInt(PORT) });
