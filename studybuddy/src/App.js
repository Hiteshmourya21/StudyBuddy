import { useQuery } from '@tanstack/react-query';
import React, {  } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { Navigate, Route, Routes } from 'react-router-dom'
import { axiosInstance } from './lib/axios.js';


import LandingPage from './pages/landing/LandingPage.js';
import HomePage from './pages/home/HomePage.js';
import Auth from './pages/auth/Auth.js';
import About from './pages/about/About.js';
import Feature from './pages/feature/Feature.js';
import Search from './pages/search/Search.js';
import Explore from './pages/explore/Explore.js';
import Quiz from './pages/quiz/Quiz.js';
import Forum from './pages/forum/Forum.js';
import Reward from './pages/reward/Reward.js';
import ProfilePage from './pages/user/ProfilePage.js';
import PostPage from './pages/PostPage.js';
import NavBar from './components/NavBar/NavBar.js';
import SingleChatPage from './pages/chat/SingleChatPAge.js';
import SingleGroupPage from './pages/chat/SingleGroupPage.js';
import MeetPage from './pages/chat/MeetPage.js';
import DashboardApp from './pages/dashboard/Home.js';


function App() {
  
  const { data : authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn : async () =>{
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (err) {
        if(err.response && err.response.status === 401){
          return null;
        }
        toast.error(err.response.data.message || "Something went wrong");
      }
    }
  });

  if(isLoading) return null;
  return (
    
      <div className="min-h-screen bg-base-100">
      {authUser && <NavBar/>}
      <Routes>
        {/* Routes Before Login */}
        <Route path="/" element={authUser ?<HomePage /> : <LandingPage />} />
        <Route path="/auth" element={!authUser? <Auth /> : <Navigate to="/" />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Feature />} />
        {/* Routes After Login */}
        <Route path="/search" element={<Search/>} />
        <Route path="/explore/*" element={<Explore/>} />
        
        <Route path="/forum/*" element={<Forum/>} />
        <Route path="/reward" element={<Reward/>} />
        {/* Routes For User */}
        <Route path="/:username/dashboard/*" element={<DashboardApp/>} />
        <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/" />} />
        <Route path="/post/:postId" element={authUser ? <PostPage /> : <Navigate to="/" />} />
        {/* Routes For Chat */}
        <Route path="/chat/:userId" element={authUser ? <SingleChatPage /> : <Navigate to="/" />} />
        <Route path="/meet/:groupId" element={<MeetPage />} />
        <Route path="/groups/:groupId" element={<SingleGroupPage />} />

        <Route path="/quiz/*" element={<Quiz/>} />
      </Routes>
      <Toaster/>
      </div>
  
  )
}

export default App
