import type { Elysia } from "elysia";

// Domain errors
export class NotFoundError extends Error {
  constructor(message: string = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends Error {
  constructor(message: string = "Invalid input") {
    super(message);
    this.name = "ValidationError";
  }
}

// Centralized error handler - maps domain errors to REST status codes
export function setupErrorHandler(app: Elysia) {
  app.onError(({ error, set }) => {
    console.error("Error:", error);

    if (error instanceof NotFoundError) {
      set.status = 404;
      return {
        error: "Not Found",
        message: error.message,
      };
    }

    if (error instanceof ValidationError) {
      set.status = 400;
      return {
        error: "Bad Request",
        message: error.message,
      };
    }

    // Default to 500 for unknown errors
    set.status = 500;
    return {
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    };
  });
}
