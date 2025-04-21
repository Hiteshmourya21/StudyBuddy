"use client"

import { useState } from "react"
import { useParams } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { User, ArrowLeft, Send } from "lucide-react"
import { Link } from "react-router-dom"
import Answer from "./Answer"
import ImageUploader from "./ImageUploader"
import { axiosInstance } from "../../lib/axios"

const QuestionDetail = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [answer, setAnswer] = useState("")
  const [image, setImage] = useState(null)

  const {
    data: question,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["question", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/forum/question/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      return response.data
    },
  })

  const submitAnswerMutation = useMutation({
    mutationFn: async (formData) => {
      return axiosInstance.post(`/forum/question/${id}/answer`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["question", id])
      setAnswer("")
      setImage(null)
    },
  })

  const handleSubmitAnswer = (e) => {
    e.preventDefault()
    if (!answer.trim()) return

    const formData = new FormData()
    formData.append("text", answer)
    if (image) {
      formData.append("image", image)
    }

    submitAnswerMutation.mutate(formData)
  }

  if (isLoading) {
    return (
      <div className="w-full p-8">
        <div className="bg-white rounded-lg p-6 shadow animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error loading question. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full p-4 md:p-8">
      <Link to="/forum" className="flex items-center text-gray-600 hover:text-orange-500 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Forum
      </Link>

      {question && (
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0">
                {question.user.profilePicture ? (
                  <img
                    src={question.user.profilePicture || "/avatar.png"}
                    alt={question.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-500" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 mb-1">{question.title}</h1>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">{question.user.name}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="prose max-w-none mb-4">
              <p className="text-gray-700 whitespace-pre-line">{question.description}</p>
            </div>

            {question.image && (
              <div className="mb-4">
                <img
                  src={question.image || "/placeholder.svg"}
                  alt="Question attachment"
                  className="rounded-md max-h-96 object-contain"
                />
              </div>
            )}

            {question.tags && question.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {question.tags.map((tag) => (
                  <span key={tag} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{question?.answers?.length || 0} Answers</h2>

          <div className="space-y-6">
            {question?.answers?.map((answer) => (
              <Answer key={answer._id} answer={answer} questionId={id} />
            ))}

            {question?.answers?.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No answers yet. Be the first to answer this question!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Answer</h2>

          <form onSubmit={handleSubmitAnswer}>
            <div className="mb-4">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your answer here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows="4"
                required
              />
            </div>

            <ImageUploader onImageSelect={setImage} selectedImage={image} />

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={submitAnswerMutation.isLoading || !answer.trim()}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitAnswerMutation.isLoading ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Answer
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default QuestionDetail

