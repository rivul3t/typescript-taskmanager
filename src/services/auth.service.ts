import prismaClient from "../lib/prisma";
import { Prisma } from "@prisma/client";
import { ApiError } from "../utils/ApiError";

export const createUser = async (
  name: string,
  password: string,
  email: string,
) => {
  try {
    return await prismaClient.user.create({
      data: {
        name: name,
        email: email,
        password: password,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new ApiError(409, "User already exists");
      }
    }
    throw error;
  }
};

export const findUser = async (name: string) => {
  const user = await prismaClient.user.findFirst({
    where: {
      name: name,
    },
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};
