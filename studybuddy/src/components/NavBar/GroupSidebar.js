import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import styles from "./GroupSidebar.module.css";

const GroupSidebar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Fetch connected users for member selection
  const { data: connectedUsers } = useQuery({
    queryKey: ["connections"],
    queryFn: async () => (await axiosInstance.get("/connections")).data,
  });

  // Fetch available study groups based on search query
  const { data: studyGroups } = useQuery({
    queryKey: ["studyGroups", searchQuery],
    queryFn: async () => (await axiosInstance.get(`/study-groups?search=${searchQuery}`)).data,
    enabled: !!searchQuery,
  });

  // Fetch groups the user is a member of
  const { data: userGroups } = useQuery({
    queryKey: ["userGroups"],
    queryFn: async () => (await axiosInstance.get("/study-groups/my-groups/info")).data,
  });

  // Create a study group mutation
  const createGroup = useMutation({
    mutationFn: async () =>
      await axiosInstance.post("/study-groups/create", {
        name: groupName,
        description: groupDescription,
        members: selectedUsers,
      }),
    onSuccess: () => {
      alert("Group Created Successfully");
      setIsPopupOpen(false);
    },
  });

  const handleGroupClick = (groupId) => {
    navigate(`/groups/${groupId}`);
  };

  return (
    <div className={styles.sidebar}>
      <h3>Study Groups</h3>
      
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search and Join a Study Group..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.searchInput}
      />

      {/* Search Results */}
      {searchQuery && (
        <ul className={styles.searchResults}>
          {studyGroups?.map((group) => (
            <li key={group._id} className={styles.groupItem} onClick={() => handleGroupClick(group._id)}>
              {group.name}
            </li>
          ))}
        </ul>
      )}

      {/* Create Group Button */}
      <button onClick={() => setIsPopupOpen(true)} className={styles.createButton}>
        Create Group
      </button>

      {/* User's Groups */}
      <h4>Your Groups</h4>
      <ul className={styles.userGroups}>
        {userGroups?.map((group) => (
          <li key={group._id} className={styles.groupItem} onClick={() => handleGroupClick(group._id)}>
            {group.name}
          </li>
        ))}
      </ul>

      {/* Create Group Popup */}
      {isPopupOpen && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h3>Create Study Group</h3>
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            
            <textarea
              placeholder="Group Description"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
            ></textarea>

            {/* Member Search & Add */}
            <h4>Add Members</h4>
            <ul className={styles.userList}>
              {connectedUsers?.map((user) => (
                <li key={user._id} className={styles.userItem}>
                  {user.name}
                  {!selectedUsers.includes(user._id) ? (<button
                    className={styles.addButton}
                    onClick={() => {
                      if (!selectedUsers.includes(user._id)) {
                        setSelectedUsers((prev) => [...prev, user._id]);
                      }
                    }}
                  >
                    +
                  </button>):(
                    <span>Selected</span>
                  )}
                 
                </li>
              ))}
            </ul>

            <button onClick={() => createGroup.mutate()} className={styles.createButton}>
              Create Group
            </button>
            <button onClick={() => setIsPopupOpen(false)} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupSidebar;
