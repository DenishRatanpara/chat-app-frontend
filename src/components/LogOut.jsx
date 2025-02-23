import axios from "axios";

export const LogOut = async (token) => {
  try {
    // Call the logout API
    await axios.post(
      "http://127.0.0.1:8000/api/auth/logout/",
      {},
      {
        headers: { Authorization: `Token ${token}` },
      }
    );
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Clear local storage regardless of the API response
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
  }
};
