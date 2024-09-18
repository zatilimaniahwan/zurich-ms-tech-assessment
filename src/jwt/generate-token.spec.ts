import { JwtService } from "@nestjs/jwt";

describe("JwtService", () => {
  let jwtService: JwtService;

  beforeEach(() => {
    // Initialize the JwtService with a mock secret
    jwtService = new JwtService({ secret: "mockSecret" });
  });

  it("should sign a valid JWT token", () => {
    const payload = {
      username: "admin",
      role: "admin",
      sub: "12345",
    };

    // Sign the token
    const token = jwtService.sign(payload);

    // Expect token to be defined and non-empty
    expect(token).toBeDefined();
    expect(token.length).toBeGreaterThan(0);

    // Verify the token and check the payload
    const decoded = jwtService.verify(token, { secret: "mockSecret" });
    expect(decoded).toEqual(expect.objectContaining(payload));
  });
});
