"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { User, ThumbsUp, ThumbsDown } from "lucide-react"
import { axiosInstance } from "../../lib/axios"

const Answer = ({ answer, questionId }) => {
  const queryClient = useQueryClient()


  const reactMutation = useMutation({
    mutationFn: async ({ answerId, reactionType }) => {
      return axiosInstance.post(
        `/forum/answer/${answerId}/react`,
        { reactionType }, // Updated to match backend
        { withCredentials: true } // Ensures cookies are sent
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["question", questionId])
    },
  })

  const handleReaction = (reactionType) => {
    reactMutation.mutate({
      answerId: answer._id,
      reactionType,
    })
  }

  // Check if the current user has already reacted
  const userId = queryClient.getQueryData(["authUser"])?._id
  const hasReactedHelpful = answer.reactions?.some(
    (r) => r.user === userId && r.type === "helpful",
  )
  const hasReactedNotHelpful = answer.reactions?.some(
    (r) => r.user === userId && r.type === "notHelpful",
  )

  // Count reactions
  const helpfulCount = answer.helpfulVotes || 0
  const notHelpfulCount = answer.notHelpfulVotes || 0

  return (
    <div className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0">
          {answer.user.profilePicture ? (
            <img
              src={answer.user.profilePicture || "/avatar.png"}
              alt={answer.user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center">
            <span className="font-medium text-gray-800">{answer.user.name}</span>
            <span className="mx-2 text-gray-500 text-sm">•</span>
            <span className="text-gray-500 text-sm">{new Date(answer.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="prose max-w-none ml-11 mb-3">
        <p className="text-gray-700 whitespace-pre-line">{answer.content}</p>
      </div>

      {answer.image && (
        <div className="ml-11 mb-3">
          <img
            src={answer.image || "/placeholder.svg"}
            alt="Answer attachment"
            className="rounded-md max-h-64 object-contain"
          />
        </div>
      )}

      <div className="flex items-center ml-11">
        <button
          onClick={() => handleReaction("helpful")}
          disabled={reactMutation.isLoading}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm mr-2 transition-colors ${
            hasReactedHelpful ? "bg-green-100 text-green-700" : "hover:bg-gray-100 text-gray-600"
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{helpfulCount}</span>
        </button>

        <button
          onClick={() => handleReaction("notHelpful")}
          disabled={reactMutation.isLoading}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
            hasReactedNotHelpful ? "bg-red-100 text-red-700" : "hover:bg-gray-100 text-gray-600"
          }`}
        >
          <ThumbsDown className="w-4 h-4" />
          <span>{notHelpfulCount}</span>
        </button>
      </div>
    </div>
  )
}

export default Answer
