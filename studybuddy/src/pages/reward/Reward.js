"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "../../lib/axios"
import { Trophy, Star, Award, BookOpen, ThumbsUp, MessageSquare } from "lucide-react"

const Reward = () => {
  const [activeTab, setActiveTab] = useState("myRewards")

  const { data: rewards, isLoading: rewardsLoading } = useQuery({
    queryKey: ["rewards"],
    queryFn: () => axiosInstance.get("/rewards"),
  })

  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => axiosInstance.get("/rewards/leaderboard"),
  })

  // Get reward breakdown by type
  const getRewardsByType = () => {
    if (!rewards || !rewards.data || rewards.data.length === 0) return {}

    const breakdown = rewards.data[0].breakdown
    const types = {}

    breakdown.forEach((item) => {
      if (!types[item.type]) {
        types[item.type] = 0
      }
      types[item.type] += item.points
    })

    return types
  }

  const rewardTypes = getRewardsByType()
  const totalPoints = rewards?.data?.[0]?.totalPoints || 0

  // Get icon based on reward type
  const getRewardIcon = (type) => {
    switch (type) {
      case "quiz_score":
        return <BookOpen className="h-6 w-6 text-orange-500" />
      case "post_like":
        return <ThumbsUp className="h-6 w-6 text-orange-500" />
      case "forum_helpful_vote":
        return <MessageSquare className="h-6 w-6 text-orange-500" />
      case "resource_like":
        return <Star className="h-6 w-6 text-orange-500" />
      default:
        return <Award className="h-6 w-6 text-orange-500" />
    }
  }

  // Format reward type for display
  const formatRewardType = (type) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Get formatted date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Calculate level based on points
  const calculateLevel = (points) => {
    if (points < 10) return 1
    if (points < 25) return 2
    if (points < 50) return 3
    if (points < 100) return 4
    return 5
  }

  const level = calculateLevel(totalPoints)
  const nextLevelPoints = level === 1 ? 10 : level === 2 ? 25 : level === 3 ? 50 : level === 4 ? 100 : 200
  const progress = (totalPoints / nextLevelPoints) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-orange-500 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Your Achievements</h1>
          <p className="text-orange-100">Track your progress and earn rewards for your learning journey</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab("myRewards")}
              className={`py-4 px-6 font-medium ${activeTab === "myRewards" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-600"}`}
            >
              My Rewards
            </button>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`py-4 px-6 font-medium ${activeTab === "leaderboard" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-600"}`}
            >
              Leaderboard
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {activeTab === "myRewards" ? (
          <>
            {rewardsLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : rewards?.data?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Level Card */}
                <div className="bg-white rounded-lg shadow-md p-6 md:col-span-3">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Level {level}</h2>
                      <p className="text-gray-600">{totalPoints} total points earned</p>
                    </div>
                    <div className="bg-orange-100 p-4 rounded-full">
                      <Trophy className="h-10 w-10 text-orange-500" />
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div
                      className="bg-orange-500 h-4 rounded-full"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {totalPoints} / {nextLevelPoints} points to Level {level + 1}
                  </p>
                </div>

                {/* Points Breakdown */}
                <div className="bg-white rounded-lg shadow-md p-6 md:col-span-3">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Points Breakdown</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.keys(rewardTypes).map((type) => (
                      <div key={type} className="bg-orange-50 rounded-lg p-4 flex items-center">
                        <div className="mr-4">{getRewardIcon(type)}</div>
                        <div>
                          <p className="font-medium text-gray-800">{formatRewardType(type)}</p>
                          <p className="text-orange-500 font-bold">{rewardTypes[type]} points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-md p-6 md:col-span-3">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    {rewards.data[0].breakdown
                      .slice()
                      .reverse()
                      .map((item, index) => (
                        <div key={index} className="border-b pb-4 last:border-0">
                          <div className="flex items-center">
                            <div className="mr-4">{getRewardIcon(item.type)}</div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{formatRewardType(item.type)}</p>
                              <p className="text-sm text-gray-600">{formatDate(item.createdAt)}</p>
                            </div>
                            <div className="bg-orange-100 px-3 py-1 rounded-full">
                              <span className="text-orange-500 font-bold">+{item.points} pts</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-orange-100 inline-block p-4 rounded-full mb-4">
                  <Award className="h-12 w-12 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Rewards Yet</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Start earning points by completing quizzes, liking resources, and participating in forum discussions!
                </p>
              </div>
            )}
          </>
        ) : (
          <LeaderboardTab isLoading={leaderboardLoading} leaderboard={leaderboard} />
        )}
      </div>
    </div>
  )
}

// Leaderboard Tab Component
const LeaderboardTab = ({ isLoading, leaderboard }) => {
  // Mock data for leaderboard since we don't have actual data
  const mockLeaderboard = [
    { _id: "1", user: { name: "Himanshu", avatar: "/avatar1.png" }, totalPoints: 120 },
    { _id: "2", user: { name: "Hitesh Mourya", avatar: "/avatar2.png" }, totalPoints: 98 },
    { _id: "3", user: { name: "Bhavya", avatar: "/avatar3.png" }, totalPoints: 87 },
    { _id: "4", user: { name: "Krishu", avatar: "/avatar4.png" }, totalPoints: 76 },
    { _id: "5", user: { name: "Rahul", avatar: "/avatar5.png" }, totalPoints: 65 },
    { _id: "6", user: { name: "Priya", avatar: "/avatar6.png" }, totalPoints: 54 },
    { _id: "7", user: { name: "Amit", avatar: "/avatar7.png" }, totalPoints: 43 },
  ]

  const data = leaderboard?.data || mockLeaderboard

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>
        <p className="text-gray-600">See how you rank among other students</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="divide-y">
          {data.map((user, index) => (
            <div key={user._id} className="p-4 flex items-center">
              <div className="w-10 text-center font-bold text-gray-700">
                {index === 0 ? (
                  <div className="bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center mx-auto">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                ) : index === 1 ? (
                  <div className="bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center mx-auto">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                ) : index === 2 ? (
                  <div className="bg-orange-400 rounded-full w-8 h-8 flex items-center justify-center mx-auto">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="ml-4 flex-1 flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
                  {user.user.avatar ? (
                    <img
                      src={user.user.avatar || "/placeholder.svg"}
                      alt={user.user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">{user.user.name.charAt(0)}</span>
                  )}
                </div>
                <span className="font-medium">{user.user.name}</span>
              </div>
              <div className="bg-orange-100 px-3 py-1 rounded-full">
                <span className="text-orange-500 font-bold">{user.totalPoints} pts</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Reward
