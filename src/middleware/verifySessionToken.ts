import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../generated/prisma";
import { User } from "../type/user";
import { RequestWithPayload } from "../type/RequestWithPayload";

const prisma = new PrismaClient();

export async function verifySessionToken(
  _: Request,
  res: Response,
  next: NextFunction
) {
  const req = _ as RequestWithPayload;
  const tokenInCookies = req.cookies?.sessionToken;

  if (!tokenInCookies) {
    res.status(401).json({ message: "No sessionToken in cookies" });
    return;
  }

  const foundSession = await prisma.session.findUnique({
    where: { token: tokenInCookies },
    include: { user: true },
  });

  if (!foundSession) {
    res.status(404).json({ error: "Session not found!" });
    res.clearCookie("sessionToken", { httpOnly: true });
    return;
  }

  const user: User = {
    id: foundSession.user.id,
    email: foundSession.user.email,
    firstName: foundSession.user.firstName,
    lastName: foundSession.user.lastName,
  };

  req.session = {
    id: foundSession.id,
    token: foundSession.token,
    userId: foundSession.userId,
    expiresAt: foundSession.expiresAt,
    user: user,
  };

  next();
}
