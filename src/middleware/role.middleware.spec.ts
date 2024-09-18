import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RoleMiddleware } from "./role.middleware";
import { NextFunction, Request, Response } from "express";

describe("RoleMiddleware", () => {
  let roleMiddleware: RoleMiddleware;
  let jwtService: JwtService;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    // Mock JwtService
    jwtService = new JwtService({});
    roleMiddleware = new RoleMiddleware(jwtService);

    // Mocking next function
    mockNext = jest.fn();
  });

  it("should allow access with a valid admin JWT token", () => {
    const validToken = "valid.admin.token";
    mockRequest = {
      headers: { authorization: `Bearer ${validToken}` },
      method: "POST",
    };
    // Mock the jwtService.verify method to return an object with the role 'admin'
    jest.spyOn(jwtService, "verify").mockReturnValue({ role: "admin" });

    expect(() =>
      roleMiddleware.use(mockRequest as any, mockResponse as any, mockNext)
    ).not.toThrow();

    expect(mockRequest["userRole"]).toBe("admin");
    expect(mockNext).toHaveBeenCalled();
  });

  it("should throw UnauthorizedException if no token is provided", () => {
    mockRequest = {
      headers: {},
    };

    expect(() =>
      roleMiddleware.use(mockRequest as any, mockResponse as any, mockNext)
    ).toThrow(new UnauthorizedException("No token found"));

    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should throw UnauthorizedException if token format is invalid", () => {
    mockRequest = {
      headers: { authorization: "Bearer" }, // Invalid format, missing token
    };

    expect(() =>
      roleMiddleware.use(mockRequest as any, mockResponse as any, mockNext)
    ).toThrow(new UnauthorizedException("Invalid token format"));

    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should throw UnauthorizedException if JWT token is invalid or expired", () => {
    const invalidToken = "invalid.token";

    mockRequest = {
      headers: { authorization: `Bearer ${invalidToken}` },
    };

    // Mocking the jwtService.verify to throw an error
    jest.spyOn(jwtService, "verify").mockImplementation(() => {
      throw new Error("Token expired or invalid");
    });

    expect(() =>
      roleMiddleware.use(mockRequest as any, mockResponse as any, mockNext)
    ).toThrow(new UnauthorizedException("Token expired or invalid"));

    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should throw UnauthorizedException if no role is found in the JWT token", () => {
    const tokenWithoutRole = "valid.token.without.role";

    mockRequest = {
      headers: { authorization: `Bearer ${tokenWithoutRole}` },
    };

    // Mocking the jwtService.verify to return an object without a role
    jest.spyOn(jwtService, "verify").mockReturnValue({});

    expect(() =>
      roleMiddleware.use(mockRequest as any, mockResponse as any, mockNext)
    ).toThrow(new UnauthorizedException("No role found in token"));

    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should throw UnauthorizedException if the route requires admin but the user is not an admin", () => {
    const nonAdminToken = "valid.user.token";

    mockRequest = {
      headers: { authorization: `Bearer ${nonAdminToken}` },
      method: "POST", // Admin-protected route (non-GET request)
    };

    // Mocking the jwtService.verify to return a non-admin role
    jest.spyOn(jwtService, "verify").mockReturnValue({ role: "user" });

    expect(() =>
      roleMiddleware.use(mockRequest as any, mockResponse as any, mockNext)
    ).toThrow(new UnauthorizedException("Only admin can access this route"));

    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should allow GET requests for non-admin users", () => {
    const nonAdminToken = "valid.user.token";

    mockRequest = {
      headers: { authorization: `Bearer ${nonAdminToken}` },
      method: "GET", // Non-admin route (GET request)
    };

    // Mocking the jwtService.verify to return a non-admin role
    jest.spyOn(jwtService, "verify").mockReturnValue({ role: "user" });

    expect(() =>
      roleMiddleware.use(mockRequest as any, mockResponse as any, mockNext)
    ).not.toThrow();

    expect(mockRequest["userRole"]).toBe("user");
    expect(mockNext).toHaveBeenCalled();
  });
});
