import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../generated/prisma";
import { asyncHandler } from "../middleware/asyncHandler";
import { z } from "zod";
import bcrypt from "bcrypt";
import AppError from "../middleware/errorHandler";

const prisma = new PrismaClient();

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      TodoTab: true,
      password: true,
    },
  });
  res.json(user);
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.findFirstOrThrow({
    where: { id: String(id) },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      password: true,
    },
  });
  res.json(user);
});

export const SignUp = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = createUserSchema.parse(req.body);
  const hashedPassword = await bcrypt.hash(validatedData.password, 10);
  const user = await prisma.user.create({
    data: { ...validatedData, password: hashedPassword },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  });
  res.status(201).json(user);
});

export const EditUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError(
      400,
      "Bad request",
      "Please provide needed credentials",
      true
    );
  }

  const validatedData = createUserSchema.parse(req.body);

  const updatedUser = await prisma.user.update({
    where: {
      id: String(id),
    },
    data: validatedData,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  });
  res.json({ message: "Updated user!!!", data: { updatedUser } });
});

export const deleteAll = asyncHandler(async (req: Request, res: Response) => {
  await prisma.user.deleteMany();
  res.send("done");
  return res.status(200).json({ message: "deleted all records" });
});
