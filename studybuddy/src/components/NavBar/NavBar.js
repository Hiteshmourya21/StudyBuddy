import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaCompass, FaBook, FaUsers, FaGift, FaEllipsisH, FaUser, FaBars, FaTimes, FaRegArrowAltCircleRight } from 'react-icons/fa';
import styles from "./NavBar.module.css";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../lib/axios';
import { LogOut } from 'lucide-react';
import ChatSidebar from './ChatSidebar';
import GroupSidebar from './GroupSidebar'; // Import GroupSidebar

const NavBar = () => {
    const [profileSidebarOpen, setProfileSidebarOpen] = useState(false);
    const [threeDotsSidebarOpen, setThreeDotsSidebarOpen] = useState(false);
    const [chatSidebarOpen, setChatSidebarOpen] = useState(false);
    const [groupSidebarOpen, setGroupSidebarOpen] = useState(false); // New State for Group Sidebar
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { data: authUser } = useQuery({ queryKey: ['authUser'] });
    const queryClient = useQueryClient();

    const { mutate: logout } = useMutation({
        mutationFn: async () => await axiosInstance.post('/auth/logout'),
        onSuccess: () => {
            queryClient.invalidateQueries(['authUser']);
        },
    });

    return (
        <div>
            <header className={styles.header}>
                <div className={styles.logoSection}>
                    <FaBook className={styles.logoIcon} />
                    <span className={styles.logoText}>
                        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>StudyBuddy</Link>
                    </span>
                </div>

                <button className={styles.menuButton} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                <nav className={styles.nav}>
                    <Link to="/" className={styles.navLink}><FaHome className={styles.icon} /> Home</Link>
                    <Link to="/search" className={styles.navLink}><FaSearch className={styles.icon} /> Search</Link>
                    <Link to="/explore" className={styles.navLink}><FaCompass className={styles.icon} /> Explore</Link>
                    <Link to="/quiz" className={styles.navLink}><FaBook className={styles.icon} /> Quiz</Link>
                    <Link to="/forum" className={styles.navLink}><FaUsers className={styles.icon} /> Forum</Link>
                    <Link to="/reward" className={styles.navLink}><FaGift className={styles.icon} /> Reward</Link>
                </nav>

                <div className='flex items-center gap-4'>
                <button className={styles.navLink} onClick={() => setThreeDotsSidebarOpen(!threeDotsSidebarOpen)}>
                        <FaEllipsisH className={styles.icon} />
                </button>

                <button className={styles.profileButton} onClick={() => setProfileSidebarOpen(!profileSidebarOpen)}>
                    <FaUser className={styles.profileIcon} />
                </button>
                </div>

            </header>

            {mobileMenuOpen && (
                <div className={styles.mobileMenu}>
                    <Link to="/" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Home</Link>
                    <Link to="/search" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Search</Link>
                    <Link to="/explore" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Explore</Link>
                    <Link to="/quiz" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Quiz</Link>
                    <Link to="/forum" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Forum</Link>
                    <Link to="/reward" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Reward</Link>
                </div>
            )}

            {/* Profile Sidebar */}
            {profileSidebarOpen && (
                <div className={`${styles.sidebar} ${styles.profileSidebar}`} onMouseLeave={() => setProfileSidebarOpen(false)}>
                    <div className={styles.menuContent}>
                        <Link to="/user/dashboard" className={styles.sidebarItem}>Dashboard</Link>
                        <Link to={`/profile/${authUser?.username}`} className={styles.sidebarItem}>Profile</Link>
                        <button onClick={() => logout()} className={styles.sidebarItem}>
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Three Dots Sidebar */}
            {threeDotsSidebarOpen && (
                <div className={`${styles.sidebar} ${styles.threeDotsSidebar}`}  onMouseLeave={() => setThreeDotsSidebarOpen(false)}>
                    <div className={styles.menuContent}>
                        <div className={styles.sidebarItem} onMouseEnter={() => setChatSidebarOpen(true)}>Chat</div>
                        <div className={styles.sidebarItem} onMouseEnter={() => setGroupSidebarOpen(true)}>Group Chat</div>
                    </div>
                </div>
            )}

            {/* Chat Sidebar */}
            {chatSidebarOpen && (
                <div className={`${styles.sidebar} ${styles.chatSidebar}`} onMouseLeave={() => setChatSidebarOpen(false)}>
                    <ChatSidebar />
                </div>
            )}

            {/* Group Chat Sidebar */}
            {groupSidebarOpen && (
                <div className={`${styles.groupSidebar}`} onMouseLeave={() => setGroupSidebarOpen(false)}>
                    <GroupSidebar />
                </div>
            )}
        </div>
    );
};

export default NavBar;
