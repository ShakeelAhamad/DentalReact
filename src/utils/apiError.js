export const getApiErrorMessage = (error) => {
  if (!error.response) {
    if (error.code === "ECONNABORTED") {
      return "The request timed out. Please try again.";
    }

    return "Unable to connect to the server. Check your internet connection.";
  }

  const status = error.response.status;
  const data = error.response.data;

  if (status === 400) {
    return (
      data?.message ||
      data?.title ||
      "Please check your login details."
    );
  }

  if (status === 401) {
    return "Invalid email or password.";
  }

  if (status === 403) {
    return "You are not allowed to access this account.";
  }

  if (status === 429) {
    return "Too many login attempts. Please try again later.";
  }

  if (status >= 500) {
    return "A server error occurred. Please try again later.";
  }

  return data?.message || "Login failed. Please try again.";
};