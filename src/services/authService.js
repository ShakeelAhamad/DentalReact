import api,{setAuthTokens,getRefreshToken,clearAuthTokens} from "../config/api";

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", {
    email: credentials.email.trim(),
    password: credentials.password,
  });

  const data = response.data;
  if (!data?.accessToken) {
    throw new Error("The server did not return an access token.");
  }
  localStorage.setItem(
    "dentalcare_user",
    JSON.stringify(data.details)
);
  setAuthTokens(data);
  return data;
};

// Logout user
export const logoutUser = async () => {
     const token = getRefreshToken();
    try {
      if (token) {
        await api.post("/auth/revoke-token", {
          refreshToken: token,
        });
        await api.post("/auth/logout");
      }
    } catch (error) {
      console.error("Server logout failed:", error);
    } finally {
      clearAuthTokens();
      sessionStorage.removeItem("dentalcare_user");
    }
};

// Update logged-in user's password
export const updatePassword = async (payload) => {
    try {
        const response = await api.put(
            "/auth/update-password",
            {
                currentPassword: payload.currentPassword,
                newPassword: payload.newPassword,
                ConfirmPassword: payload.confirmPassword,
            }
        );

        return response.data;

    } catch (error) {
        throw error.response?.data || {
            success: false,
            message: "Unable to update password. Please try again.",
        };
    }
};

//get user profile data
export const userProfile = async () => {
  try {
    const response = await api.get("/auth/profile");
    return response.data;
  } catch(error){
    throw error.response?.data || {
      success : false,
      message : "Unable to get user profile",
    };
  }
};