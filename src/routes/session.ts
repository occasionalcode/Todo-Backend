import express from "express";
import { login, logout } from "../handlers/auth";

export const router = express.Router();

router.post("/login", login);
