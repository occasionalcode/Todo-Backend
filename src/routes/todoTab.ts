import express from "express";
import {
  createTodoTab,
  deleteAllTodoTab,
  deleteTodoTabById,
  getAllTodoTab,
  getTodoTabById,
} from "../handlers/todoTab";
import { deleteAll } from "../handlers/users";

export const router = express.Router();

router
  .get("/", getAllTodoTab)
  .get("/:id", getTodoTabById)
  .post("/", createTodoTab)
  .delete("/delete/:id", deleteTodoTabById)
  .delete("/deleteall", deleteAllTodoTab);
