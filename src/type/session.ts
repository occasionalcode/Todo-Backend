import { User } from "./user";

export type Session = {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  user: User;
};
