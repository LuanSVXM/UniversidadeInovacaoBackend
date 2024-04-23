import { Request, Response, NextFunction } from "express";
import SendMessage from "../helpers/message.helper";
import jwt from "jsonwebtoken";
import { VerifyJWT } from "../helpers/jwt.helper";

interface Itoken {
  employee?: string;
}

export default async function AuthorizationEnsure(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    if (!request.headers.authorization) {
      return response.status(501).json(SendMessage("Sem Permissão"));
    }

    const resultToken: (Itoken & string) | jwt.JwtPayload = VerifyJWT(
      String(request.headers.authorization)
    );

    if (!resultToken?.employee) {
      return response.status(501).json(SendMessage("Sem Permissão"));
    }

    next();
  } catch (err: any) {
    return response.status(501).json(SendMessage("Sem Permissão"));
  }
}
