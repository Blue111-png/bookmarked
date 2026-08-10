import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  sub: string;
  email: string;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({ error: "Missing or malformed Authorization header" });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
