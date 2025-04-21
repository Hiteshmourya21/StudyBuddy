"use client"

import React, { useState, useRef } from "react"
import { Image, X } from "lucide-react"

const ImageUploader = ({ onImageSelect, selectedImage }) => {
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    onImageSelect(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    onImageSelect(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // If we have a selectedImage that's already a string URL (from server)
  React.useEffect(() => {
    if (selectedImage && typeof selectedImage === "string") {
      setPreview(selectedImage)
    } else if (!selectedImage) {
      setPreview(null)
    }
  }, [selectedImage])

  return (
    <div className="space-y-2">
      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <Image className="w-6 h-6 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500">Click to upload an image</p>
          <p className="text-xs text-gray-400 mt-1">(Optional)</p>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="max-h-48 rounded-md object-contain border border-gray-200"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1 hover:bg-opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
    </div>
  )
}

export default ImageUploader

