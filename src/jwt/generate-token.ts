import { JwtService } from "@nestjs/jwt";

const jwtService = new JwtService({ secret: process.env.JWT_SECRET });

const token = jwtService.sign({
  username: "admin",
  role: "admin",
  sub: "12345",
});
console.log(token);
