import { randomUUID } from "crypto";
import { PrismaClient } from "../generated/prisma";
import { asyncHandler } from "../middleware/asyncHandler";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { Session } from "inspector/promises";
import { error } from "console";
import { date } from "zod";
import bcrypt from "bcrypt";
import AppError, { errorHandler } from "../middleware/errorHandler";
import { RequestWithPayload } from "../type/RequestWithPayload";
import { TOKEN_COOKIE_MAXAGE, TOKEN_EXPIRY_DATE } from "../constants/session";

const prisma = new PrismaClient();

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const foundUser = await prisma.user.findUnique({
    where: { email: email },
    select: {
      email: true,
      id: true,
      firstName: true,
      lastName: true,
      password: true,
    },
  });

  if (!foundUser) {
    throw new AppError(404, "Not Found", "User does not exist", true);
  }
  const isPasswordValid = await bcrypt.compare(password, foundUser.password);

  if (!isPasswordValid) {
    throw new AppError(404, "Not Found", "Password Invalid", true);
  }
  const sessionToken = uuidv4();

  const newSession = await prisma.session.create({
    data: {
      token: sessionToken,
      expiresAt: TOKEN_EXPIRY_DATE,
      user: { connect: { id: foundUser.id } },
    },
  });

  res.cookie("sessionToken", sessionToken, {
    httpOnly: true,
    maxAge: TOKEN_COOKIE_MAXAGE,
  });

  res.json({
    welcome: "you are logged in!",
    data: {
      session: newSession,
    },
  });
});

export const logout = asyncHandler(async (_: Request, res: Response) => {
  const req = _ as RequestWithPayload;

  await prisma.session.delete({
    where: { id: req.session.id },
  });
  res.clearCookie("sessionToken", {
    httpOnly: true,
  });

  res.status(200).json({ message: "Logged out" });
});
