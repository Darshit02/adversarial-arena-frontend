import { type RFC7807ProblemDetails } from "@/types/api";

export class ApiError extends Error {
  public status: number;
  public problem?: RFC7807ProblemDetails;
  public requestId?: string;

  constructor(
    problemOrMessage: RFC7807ProblemDetails | string,
    status = 500,
    requestId?: string
  ) {
    if (typeof problemOrMessage === "string") {
      super(problemOrMessage);
      this.status = status;
      this.requestId = requestId;
    } else {
      super(
        problemOrMessage.detail ||
          problemOrMessage.title ||
          "An unexpected API error occurred"
      );
      this.status = problemOrMessage.status || status;
      this.problem = problemOrMessage;
      this.requestId =
        requestId ||
        (problemOrMessage.instance as string | undefined);
    }
    this.name = "ApiError";
  }
}

export function isUnauthorized(err: unknown): err is ApiError {
  return err instanceof ApiError && err.status === 401;
}

export function isNotFound(err: unknown): err is ApiError {
  return err instanceof ApiError && err.status === 404;
}

export function isRateLimited(err: unknown): err is ApiError {
  return err instanceof ApiError && err.status === 429;
}

export function extractErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.problem?.invalid_params && err.problem.invalid_params.length > 0) {
      const details = err.problem.invalid_params
        .map((p) => `${p.name}: ${p.reason}`)
        .join(", ");
      return `${err.problem.detail || err.message} (${details})`;
    }
    return err.problem?.detail || err.problem?.title || err.message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "An unexpected error occurred";
}
