import axios from "axios";

export const LogOut = async (token) => {
  try {
    // Call the logout API
    await axios.post(
      "https://web-chat-application-a0f4.onrender.com/api/auth/logout/",
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
