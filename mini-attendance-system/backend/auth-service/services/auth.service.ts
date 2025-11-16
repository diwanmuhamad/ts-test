import { prisma } from "../../src/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../src/lib/config";

interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export const register = async ({ email, password, name }: RegisterInput) => {
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) throw new Error("Email already registered");

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashed },
  });

  return { id: user.id, email: user.email };
};

interface LoginInput {
  email: string;
  password: string;
}

export const login = async ({ email, password }: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
    expiresIn: "1d",
  });

  return token;
};
