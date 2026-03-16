export const baseUrl = "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const postRequest = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    let message;

    if (data?.message) {
      message = data.message;
    } else {
      message = data;
    }

    return { error: true, status: response.status, message };
  }

  return data;
};

export const getRequest = async (url) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return {
        error: true,
        status: response.status,
        message: data?.message ?? "Request failed.",
      };
    }
    return data;
  } catch (error) {
    console.error("Error making GET request:", error);
    return { error: true, message: "An error occurred while making the request." };
  }
};