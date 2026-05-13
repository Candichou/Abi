import type { ZodError } from "zod";

export function formatZodErrors<T extends Record<string, unknown>>(
  error: ZodError<T>,
): Partial<Record<keyof T, string>> {
  return error.issues.reduce(
    (acc, issue) => {
      const field = issue.path[0] as keyof T;
      if (field && !acc[field]) acc[field] = issue.message;
      return acc;
    },
    {} as Partial<Record<keyof T, string>>,
  );
}
