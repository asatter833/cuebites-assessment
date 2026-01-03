import { Prisma } from "@/generated/prisma/client";

export function handlePrismaError(err: unknown) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        // Unique constraint failed
        return `Duplicate value exists`;
      case "P2003":
        // Foreign key constraint failed
        return "Foreign key constraint failed";
      default:
        return `Prisma error: ${err.message}`;
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return `Prisma validation error: ${err.message}`;
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "Unknown error occurred";
}
