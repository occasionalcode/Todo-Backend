import { Request, Response, NextFunction } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

type ErrorResponse = {
  httpCode: number;
  message: string;
  name: string;
  stack?: string;
  errors?: Error;
};

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //log the error
  console.error(error);

  //default error configuration
  let response: ErrorResponse = {
    httpCode: 500,
    name: error.name,
    message: "An error occured in the server.",
  };

  if (error instanceof AppError) {
    response.httpCode = error.httpCode;
    response.message = error.message;
  } else if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      response.httpCode = 404;
      response.message = "Not found.";
    } else {
      response.httpCode = 400;
      response.message = "A database operation failed.";
    }
    response.errors = error;
  } else {
    response.message = error.message;
    response.name = error.name;
  }

  res.status(response.httpCode).json(response);
};

export default class AppError extends Error {
  public readonly httpCode: number;
  public readonly name: string;
  public readonly isOperational: boolean;

  constructor(
    httpCode: number,
    name: string,
    errorMessage: string,
    isOperational: boolean
  ) {
    super(errorMessage);
    this.httpCode = httpCode;
    this.name = name;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}
