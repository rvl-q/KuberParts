// import { serve } from "https://deno.land/std@0.120.0/http/server.ts";
import { Application, Router } from "https://deno.land/x/oak@v10.1.0/mod.ts";
// import { configure } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import * as todoController from "./controllers/todoController.js";
import * as imageController from "./controllers/imageController.js";
// import * as requestUtils from "./utils/requestUtils.js";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

const app = new Application();
const router = new Router();
const PORT = Deno.env.get("PORT");

const IMAGE_PATH = "./images/image.jpg";

// configure({
//   views: `${Deno.cwd()}/views/`,
// });

const root = async ({ request, response }) => {
  console.log("Method", request.method);
  // response.body = await todoController.viewTodos({ request });
  response.body = "OK";
};

const getTodos = async ({ request, response }) => {
  const resp_l = await todoController.listTodos({ request, response });
  response.body = resp_l;
};

const newTodo = async ({ context, request, response }) => {
  // console.log("before new todo");
  await todoController.newTodo({ context, request, response });
  // console.log("after new todo");
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
router.post("/todos", newTodo);

// for local testing before they share the same port
app.use(oakCors());

app.use(router.routes());

app.listen({ port: parseInt(PORT) });
