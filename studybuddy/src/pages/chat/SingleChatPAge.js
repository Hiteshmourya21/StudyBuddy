import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { sendMessage, fetchMessages } from "../../api/chatApi";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

import Sidebar from "../../components/Sidebar";
import RecommendedUser from "../../components/RecommendedUser";
import { formatDistanceToNow } from "date-fns";

const SingleChatPage = () => {
  const { userId } = useParams();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [receiver, setReceiver] = useState(null);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get(`/users/Id/${userId}`);
        setReceiver(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (userId) {
      fetchUserInfo();
    }
  }, [userId]);

  // Fetch messages
  const { data: messages, isLoading } = useQuery({
    queryKey: ["chat", userId],
    queryFn: () => fetchMessages(userId),
    refetchInterval: 1000,
  });

  // Fetch recommended users
  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/suggestions");
      return res.data;
    },
  });

  // Send message mutation
  const mutation = useMutation({
    mutationFn: ({ userId, message }) => sendMessage({ userId, message }),
    onSuccess: () => {
      queryClient.invalidateQueries(["chat", userId]);
      toast.success("Message sent");
      setMessage("");
    },
    onError: () => toast.error("Failed to send message"),
  });

  const handleSendMessage = () => {
    if (message.trim() === "") return;
    mutation.mutate({ userId, message });
  };

  return (
    <div className="max-w-10xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
        {/* Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <Sidebar user={authUser} />
        </div>

        {/* Chat Section */}
        <div className="col-span-1 lg:col-span-2 flex flex-col bg-gray-100 h-[80vh] rounded-lg shadow-lg">
          {/* Chat Header */}
          <div className="p-4 bg-orange-500 text-white font-bold text-lg flex items-center">
            <img
              src={receiver?.profilePicture || "/avatar.png"}
              alt={receiver?.name}
              className="w-10 h-10 rounded-full mr-2"
            />
             <Link to={`/profile/${receiver?.username}`}>{receiver?.name}</Link>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {isLoading ? (
              <p>Loading messages...</p>
            ) : (
              messages?.map((msg) => (
                <div
                  key={msg._id}
                  className={`p-2 my-2 max-w-xs rounded-lg ${
                    msg.sender._id === authUser._id
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-300 text-black mr-auto"
                  }`}
                >
                  {msg.content}
                  <span className='text-xs text-white float-right'>
                        {formatDistanceToNow(new Date(msg.timestamp))}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 bg-white flex items-center gap-2 border-t">
            <input
              type="text"
              className="flex-1 p-2 border rounded-lg"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="bg-orange-500 text-white p-2 rounded-lg"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>

        {/* Recommended Users */}
        {recommendedUsers?.length > 0 && (
          <div className="col-span-1 lg:col-span-1 hidden lg:block">
            <div className="bg-secondary rounded-lg shadow p-4">
              <h2 className="font-semibold mb-4">People you may know</h2>
              {recommendedUsers?.map((user) => (
                <RecommendedUser key={user._id} user={user} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleChatPage;
