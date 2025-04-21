import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router-dom";
import styles from "./ChatSidebar.module.css";

const ChatSidebar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [recentChats, setRecentChats] = useState([]);

    // Fetch recommended & recent chats
    useEffect(() => {
        axiosInstance.get("/chat/recent").then(res => {
            setRecentChats(res.data);
        });
    }, []);

    // Handle Search
    const handleSearch = async (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value.length > 0) {
            const res = await axiosInstance.get(`/chat/search?query=${e.target.value}`);
            setSearchResults(res.data);
        } else {
            setSearchResults([]);
        }
    };

    return (
        <div className={styles.chatSidebarContainer}>
            {/* Search Bar */}
            <input 
                type="text" 
                placeholder="Search users..." 
                className={styles.searchBar} 
                value={searchTerm} 
                onChange={handleSearch} 
            />

            

            {/* Search Results */}
            {searchResults.length > 0 && (
                <>
                    <h3 className={styles.sectionTitle}>Search Results</h3>
                    <div className={styles.userList}>
                        {searchResults.map(user => (
                            <Link key={user._id} to={`/chat/${user._id}`} className={styles.userItem}>
                                <img src={user.profilePicture || "/avatar.png"} alt={user.name} className={styles.userImage} />
                                <span>{user.name}</span>
                            </Link>
                        ))}
                    </div>
                </>
            )}

            {/* Recent Chats */}
            <h3 className={styles.sectionTitle}>Recent Chats</h3>
            <div className={styles.userList}>
                {recentChats.map(user => (
                    <Link key={user._id} to={`/chat/${user._id}`} className={styles.userItem}>
                        <img src={user.profilePicture || "/avatar.png"} alt={user.name} className={styles.userImage} />
                        <span>{user.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ChatSidebar;
