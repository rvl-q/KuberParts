import { renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";
// import * as requestUtils from "../utils/requestUtils.js";

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const viewTodos = async (request) => {
  const todos = [
    "Add an input field. The input should not take todos that are over 140 characters long.",
    "Add a send button. It does not have to send the todo yet.",
    "Add a list for the existing todos with some hardcoded todos.",
  ];
  const data = {
    todos: todos,
  };

  return new Response(await renderFile("index.eta", data), responseDetails);
};

export { viewTodos };
