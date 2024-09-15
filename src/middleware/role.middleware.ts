import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction } from "express";

@Injectable()
export class RoleMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];

    if (!authHeader) throw new UnauthorizedException("No token found");

    const token = authHeader.split(" ")[1];
    if (!token) throw new UnauthorizedException("Invalid token format");

    try {
      // Decrypt and verify JWT token
      const decode = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      // check if user role exists in token
      const userRole = decode.role;
      if (!userRole) throw new UnauthorizedException("No role found in token");
      // Attach user role to request
      req["userRole"] = userRole;

      // if it's an admin-protected route, check if user has admin role
      if (req.method !== "GET" && userRole !== "admin") {
        throw new UnauthorizedException("Only admins can access this route");
      }

      next();
    } catch (e) {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
