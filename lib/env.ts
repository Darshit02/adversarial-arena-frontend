import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .min(1, "Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"),
  NEXT_PUBLIC_API_URL: z
    .string()
    .url("NEXT_PUBLIC_API_URL must be a valid URL")
    .default("http://localhost:8000"),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL must be a valid URL")
    .default("http://localhost:3000"),
});

const isBuildOrTest =
  process.env.NODE_ENV === "test" ||
  process.env.NEXT_PHASE === "phase-production-build";

const parseResult = envSchema.safeParse({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    (isBuildOrTest ? "pk_test_placeholder_key" : undefined),
  NEXT_PUBLIC_API_URL:
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

if (!parseResult.success) {
  const formattedErrors = parseResult.error.issues
    .map((err) => `  - ${err.path.join(".")}: ${err.message}`)
    .join("\n");
  throw new Error(
    `[ENV VALIDATION ERROR] Missing or invalid environment variables:\n${formattedErrors}\n\nPlease check your .env.local file.`
  );
}

const parsed = parseResult.data;

export const env = Object.freeze({
  CLERK_PUBLISHABLE_KEY: parsed.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  API_URL: parsed.NEXT_PUBLIC_API_URL,
  APP_URL: parsed.NEXT_PUBLIC_APP_URL,
});
