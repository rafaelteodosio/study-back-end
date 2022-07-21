export const response = (
  data: Record<string, unknown> | null = null,
  message: string | null = null,
) => ({
  status: "success",
  data,
  message,
});

export const error = (
  message: string,
) => ({
  status: "error",
  data: null,
  message,
});
