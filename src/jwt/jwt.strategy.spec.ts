import { JwtStrategy } from "./jwt.strategy";
import { Test, TestingModule } from "@nestjs/testing";

describe("JwtStrategy", () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it("should be defined", () => {
    expect(jwtStrategy).toBeDefined();
  });

  it("should validate the JWT payload and return user object", async () => {
    const payload = {
      sub: "12345",
      username: "admin",
      role: "admin",
    };

    const result = await jwtStrategy.validate(payload);

    expect(result).toEqual({
      sub: payload.sub,
      username: payload.username,
      role: payload.role,
    });
  });
});
