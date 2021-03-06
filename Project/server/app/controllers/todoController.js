// import { renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";
// import * as requestUtils from "../utils/requestUtils.js";

import { executeQuery } from "../database/database.js";

const MAX_LENGTH = 140;

// const responseDetails = {
//   headers: { "Content-Type": "text/html;charset=UTF-8" },
// };

const initial_todos = [
  {
    id: 1,
    content: "Exercise 3.03: Project v1.4",
  },
  {
    id: 2,
    content: "Exercise 3.04: Project v1.41",
  },
  {
    id: 3,
    content: "Exercise 3.05: Project v1.42",
  },
  {
    id: 4,
    content: "Exercise 3.03: Project v1.4 pers. volume!",
  },
];

const initTodoTable = async () => {
  // let item;
  let db1_response = await executeQuery(
    `CREATE TABLE IF NOT EXISTS todos(
      id SERIAL PRIMARY KEY,
      content VARCHAR(140)
    );`,
  );
  // console.log("db setup response:\n", db1_response);
  db1_response = await executeQuery(
    `SELECT COUNT(content) FROM
      todos
    ;`,
  );
  // console.log("number of rows...", db1_response);
  // { rows: [ { count: 1n } ] }
  const n = Number(db1_response.rows[0].count);
  // console.log("...Number of rows:", n);

  // array.forEach((value) => {
  //   console.log(value);
  // });

  if (n < 1) {
    initial_todos.forEach(async (item) => {
      // console.log("item is:", item);
      // console.log(item.id, " , ", item.content);
      // Adding a few initial Todos, if db empty
      db1_response = await executeQuery(
        `INSERT INTO todos (content) VALUES ('${item.content}');`,
      );
      // console.log("response was", db1_response);
    });
  }

  db1_response = await executeQuery(
    `SELECT COUNT(content) FROM
      todos
    ;`,
  );
  // console.log("AFTER!\nnumber of rows...", db1_response);
  // // { rows: [ { count: 1n } ] }
  // const nn = Number(db1_response.rows[0].count);
  // console.log("...Number of rows:", nn);
};

// const listTodos = async ({ request, response }) => {
// const listTodos = async ({ response }) => {
const listTodos = async ({ request }) => {
  // console.log("remember curly braces!");
  console.log("GET requeset to:", request.url.href);

  let _db_todos = [];
  const db_response = await executeQuery(
    `SELECT * FROM
      todos
    ;`,
  );

  // console.log("response all todos:\n", db_response);
  // const data = {
  //   todos: db_todos,
  // };

  _db_todos = db_response.rows;
  return _db_todos;
  // response.headers.set('Content-Type', 'application/json')
  // return initial_todos;
  // response.body = initial_todos; // auto json!
  // return new Response(JSON.stringify(todos), jsonResponseDetails);
};

const newTodo = async ({ request, response }) => {
  const newTodo = {
    id: 9,
    content: "dummy empty todo",
  };

  if (request.body) {
    // console.log("Body:\n", request.body());

    const body = request.body();
    // console.log("The type of the request body is:");
    // console.log(body.type);

    // note, this is not a function call!
    const params = await body.value;
    // console.log("Params are as follows:");
    // console.log(params);
    console.log(request.url.href, "New todo request with content:");
    console.log(params.content);

    // console.log(params.get("content"));
    // console.log(params.get.todo);
    // console.log("next step, updating...");

    // const todoText = params.get("todo");
    const todoText = params.content;
    if (todoText && todoText.length > 0 && todoText.length <= MAX_LENGTH) {
      // console.log("length ok");
      newTodo.content = todoText;

      // refactor to params ASAP!
      await executeQuery(
        `INSERT INTO todos (content) VALUES ($1);`,
        todoText,
      );

      // console.log("Updated todos!");
      response.body = newTodo;
    } else {
      console.log("Rejected!");
      // response.status = 400; // maybe not a good idea...
      response.status = 422; // better?
      response.body = { bad_request: "422" };
    }
  }

  // response.type = 200;
  // response.body = initial_todos;
};

// export { listTodos, newTodo, viewTodos, initTodoTable };
export { initTodoTable, listTodos, newTodo };
