
import { axiosInstance } from "../lib/axios";


export const fetchMessages = async (userId) => {
  try {
    const response = await axiosInstance.get(`/chat/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch messages");
  }
};

export const sendMessage = async ({ userId, message }) => {
  try {
    const response = await axiosInstance.post(`/chat/send`, { userId, message });
    return response.data;
  } catch (error) {
    throw new Error("Failed to send message");
  }
};
