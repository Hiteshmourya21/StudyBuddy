"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import toast from "react-hot-toast"
import ProfileHeader from "../../components/User/ProfileHeader"
import AboutSection from "../../components/User/AboutSection"
import EducationSection from "../../components/User/EducationSection"
import ResourcesSection from "../../components/User/ResourcesSection"
import { axiosInstance } from "../../lib/axios.js"

const ProfilePage = () => {
  const { username } = useParams()
  const queryClient = useQueryClient()

  const { data: authUser, isLoading } = useQuery({ queryKey: ["authUser"] })

  const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: () => axiosInstance.get(`/users/${username}`),
  })

  const { mutate: updateProfile } = useMutation({
    mutationFn: async (updatedData) => {
      await axiosInstance.put("/users/profile", updatedData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfile", username])
      toast.success("Profile updated successfully")
    },
  })

  if (isLoading || isUserProfileLoading) return null

  const isOwnProfile = authUser.username === userProfile.data.username
  const userData = isOwnProfile ? authUser : userProfile.data

  const handleSave = (updatedData) => {
    updateProfile(updatedData)
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
      <ResourcesSection userData={userData} isOwnProfile={isOwnProfile} />
      <AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
      <EducationSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
    </div>
  )
}

export default ProfilePage

