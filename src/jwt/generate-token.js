"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt_1 = require("@nestjs/jwt");
var jwtService = new jwt_1.JwtService({ secret: process.env.JWT_SECRET });
var token = jwtService.sign({
  username: "general",
  role: "public",
  sub: "12345",
});
console.log(token);
