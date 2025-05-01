import express from "express";
import {
  SignUp,
  deleteAll,
  EditUser,
  getAllUsers,
  getUserById,
} from "../handlers/users";

export const router = express.Router();

router
  .get("/", getAllUsers)
  .get("/:id", getUserById)
  .post("/", SignUp)
  .put("/:id/edit", EditUser)
  .delete("/deleteAll", deleteAll);
