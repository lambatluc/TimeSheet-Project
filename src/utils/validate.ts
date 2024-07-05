export const validateError = (error: unknown): string => {
  const errorMessage = error as {
    error?: {
      message?: string
    }
  };
  if (typeof errorMessage?.error?.message === 'string' && errorMessage?.error?.message.length > 0) {
    return errorMessage?.error?.message;
  }
  return 'Something went wrong!';
};
