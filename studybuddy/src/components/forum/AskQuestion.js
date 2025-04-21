"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Send } from "lucide-react"
import { Link } from "react-router-dom"
import ImageUploader from "./ImageUploader"
import { axiosInstance } from "../../lib/axios"

const AskQuestion = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")
  const [image, setImage] = useState(null)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const askQuestionMutation = useMutation({
    mutationFn: async (formData) => {
      return axiosInstance.post("/forum/question", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries(["questions"])
      navigate(`/forum/question/${response.data._id}`)
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", content)

    if (tags.trim()) {
      // Split tags by comma and trim whitespace
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)
      formData.append("tags", JSON.stringify(tagArray))
    }

    if (image) {
      formData.append("image", image)
    }

    askQuestionMutation.mutate(formData)
  }

  return (
    <div className="w-full p-4 md:p-8">
      <Link to="/forum" className="flex items-center text-gray-600 hover:text-orange-500 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Forum
      </Link>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Ask a Question</h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Question Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., How do I solve this calculus problem?"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Question Details
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe your question in detail..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows="6"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., calculus, mathematics, homework"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Add up to 5 tags to help others find your question</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Add an Image (Optional)</label>
              <ImageUploader onImageSelect={setImage} selectedImage={image} />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={askQuestionMutation.isLoading || !title.trim() || !content.trim()}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {askQuestionMutation.isLoading ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Post Question
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

export default AskQuestion

