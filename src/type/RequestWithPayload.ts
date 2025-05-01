import { Session } from "./session";
import { Request } from "express";

export type RequestWithPayload = Request & {
  session: Session;
};
