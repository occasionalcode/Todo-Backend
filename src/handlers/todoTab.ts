import { Request, Response, NextFunction } from "express";

import { asyncHandler } from "../middleware/asyncHandler";
import { RequestWithPayload } from "../type/RequestWithPayload";
import { PrismaClient } from "../generated/prisma";
import { todo } from "node:test";

const prisma = new PrismaClient();

export const getAllTodoTab = asyncHandler(async (_: Request, res: Response) => {
  const req = _ as RequestWithPayload;
  const todoTab = await prisma.todoTab.findMany({
    include: { user: true },
  });
  res.json({ message: "All Todo Tabs", data: todoTab });
});
export const getTodoTabById = asyncHandler(
  async (_: Request, res: Response) => {
    const req = _ as RequestWithPayload;
    const { id } = req.params;
    const todoTab = await prisma.todoTab.findFirstOrThrow({
      where: { id: String(id) },
      include: { user: true },
    });
    res.json({ message: "All Todo Tabs", data: todoTab });
  }
);
export const createTodoTab = asyncHandler(async (_: Request, res: Response) => {
  const req = _ as RequestWithPayload;
  const { title } = req.body;

  const todoTab = await prisma.todoTab.create({
    data: { title: title, user: { connect: { id: req.session.user.id } } },
  });
  res
    .status(201)
    .json({ message: "Created Todo Tab!!!", data: { TodoTab: todoTab } });
});
export const deleteTodoTabById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.todoTab.delete({ where: { id: String(id) } });
    res.send("done");
    res.json({ message: "Deleted Todo Tab!!!" });
  }
);
export const deleteAllTodoTab = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.todoTab.deleteMany();
    res.json({ message: "Deleted Todo Tab!!!" });
  }
);
