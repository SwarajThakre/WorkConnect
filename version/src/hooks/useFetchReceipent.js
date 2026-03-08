import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utilities/service";

export const useFetchRecipientUser = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  const recipientId = chat?.members.find((id) => id !== user?.id);

  useEffect(() => {
    const getRecipientUser = async () => {
      if (!recipientId) return; // Return early if there's no recipientId

      try {
        const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);

        if (response.error) {
          setError(response.error);
        } else {
          setRecipientUser(response);
        }
      } catch (error) {
        console.error("Error fetching recipient user:", error);
        setError("Failed to fetch recipient user.");
      }
    };

    getRecipientUser();
  }, [recipientId]);

  return { recipientUser, error }; // Return the 'error' state as well
};
