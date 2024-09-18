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

  /**
   * Middleware to check if the request has a valid JWT token.
   * If the token is valid, it extracts the user role from the token and
   * attaches it to the request.
   * If the route is an admin-protected route, it checks if the user has
   * the admin role.
   * If the token is invalid or no token is provided, it throws an
   * UnauthorizedException.
   *
   * @param req - The express request object.
   * @param _ - The express response object.
   * @param next - The express next function.
   */
  use(req: Request, _: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];

    if (!authHeader) throw new UnauthorizedException("No token found");

    const token = authHeader.split(" ")[1];
    if (!token) throw new UnauthorizedException("Invalid token format");

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
      throw new UnauthorizedException("Only admin can access this route");
    }

    next();
  }
}
