import express from "express";
import { router as UsersRoute } from "./routes/users";
import cookieParser from "cookie-parser";
import { router as SessionsRoute } from "./routes/session";
import { verifySessionToken } from "./middleware/verifySessionToken";
import { RequestWithPayload } from "./type/RequestWithPayload";
import { errorHandler } from "./middleware/errorHandler";
import { logout } from "./handlers/auth";
import { router as TodoTabRoute } from "./routes/todoTab";

const app = express();

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/users", UsersRoute);
app.use("/api/auth", SessionsRoute);

// secured routes
app.use(verifySessionToken);

app.post("/api/auth/logout", logout);

app.get("/api/me", (_, res) => {
  const req = _ as RequestWithPayload;
  res.json(req.session);
});

app.use("/api/todotab", TodoTabRoute);

app.use(errorHandler);

const port = 8080;
app.listen(port, () => console.log(`listening on port: ${port}`));
