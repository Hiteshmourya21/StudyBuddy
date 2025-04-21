import { Link, useParams,useNavigate  } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

import Sidebar from "../../components/Sidebar";
import RecommendedUser from "../../components/RecommendedUser";
import { formatDistanceToNow } from "date-fns";

const SingleGroupPage = () => {
  const { groupId } = useParams();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [group, setGroup] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [meetingLink, setMeetingLink] = useState(null);


  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        const response = await axiosInstance.get(`/study-groups/${groupId}`);
        setGroup(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (groupId) {
      fetchGroupInfo();
    }
  }, [groupId]);

  const navigate = useNavigate();


  // Fetch group messages
  const { data: messages, isLoading } = useQuery({
    queryKey: ["groupChat", groupId],
    queryFn: async () => (await axiosInstance.get(`/study-groups/${groupId}/messages`)).data,
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
    mutationFn: ({ groupId, message }) => {
       const response = axiosInstance.post(`/study-groups/${groupId}/messages`, { message });
       return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["groupChat", groupId]);
      toast.success("Message sent");
      setMessage("");
    },
    onError: () => toast.error("Failed to send message"),
  });

  const handleSendMessage = () => {
    if (message.trim() === "") return;
    mutation.mutate({ groupId, message });
  };

  const handleStartMeeting = () => {
    navigate(`/meet/${groupId}`);
  };
  

  return (
    <div className="max-w-10xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
        {/* Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <Sidebar user={authUser} />
        </div>

        {/* Group Chat Section */}
        <div className="col-span-1 lg:col-span-2 flex flex-col bg-gray-100 h-[80vh] rounded-lg shadow-lg">
          {/* Chat Header */}
          <div className="p-4 bg-orange-500 text-white font-bold text-lg flex items-center justify-between">
            <span onClick={() => setShowInfo(!showInfo)} className="cursor-pointer">
                {group?.name}
            </span>
            <button
                onClick={handleStartMeeting}
                className="bg-white text-orange-500 px-3 py-1 rounded-lg text-sm"
            >
                Start Meeting
            </button>
            </div>
            {meetingLink && (
            <div className="p-2 bg-gray-200 text-center">
                <p>Meeting in progress! <a href={meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Join Here</a></p>
            </div>
            )}

          {/* Conditional Rendering */}
          {showInfo ? (
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{group?.description}</h2>
              <h3 className="font-semibold mb-2">Members:</h3>
              <ul>
                {group?.members.map((member) => (
                  <li key={member._id} className="p-2 bg-gray-200 rounded-lg mb-1">
                    {member.name}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
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
                      <span className='text-xs text-white float-right flex flex-col'>
                        <span>
                          {formatDistanceToNow(new Date(msg.timestamp))}
                        </span>
                        <span className='text-xs text-orange-100'>
                        ~{msg.sender.name}
                        </span>
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
            </>
          )}
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

export default SingleGroupPage;
