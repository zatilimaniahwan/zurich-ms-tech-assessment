"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt_1 = require("@nestjs/jwt");
var jwtService = new jwt_1.JwtService({ secret: process.env.JWT_SECRET });

// replace the role and username before generating the token
var token = jwtService.sign({
  username: "admin",
  role: "admin",
  sub: "12345",
});
console.log(token);
