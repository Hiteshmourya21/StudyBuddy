import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-hot-toast";
import { Heart, Link, Plus, Trash } from 'lucide-react';

const ResourcesSection = ({ userData, isOwnProfile }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newResource, setNewResource] = useState({
    name: "",
    link: ""
  });
  const queryClient = useQueryClient();

  const authUser = useQuery({
    queryKey: ["authUser"],
  }).data;

  // Fetch user resources
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["userResources", userData._id],
    queryFn: () => axiosInstance.get(`/users/${userData._id}/resources`).then(res => res.data),
  });

  // Add new resource
  const { mutate: addResource } = useMutation({
    mutationFn: (resourceData) => axiosInstance.post("/users/resource", resourceData),
    onSuccess: () => {
      toast.success("Resource added successfully");
      queryClient.invalidateQueries(["userResources", userData._id]);
      setNewResource({ name: "", link: "" });
      setIsAdding(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add resource");
    }
  });

  // Delete resource
  const { mutate: deleteResource } = useMutation({
    mutationFn: (resourceId) => axiosInstance.delete(`/users/resource/${resourceId}`),
    onSuccess: () => {
      toast.success("Resource deleted successfully");
      queryClient.invalidateQueries(["userResources", userData._id]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete resource");
    }
  });

  // Like/unlike resource
  const { mutate: toggleLike } = useMutation({
    mutationFn: (resourceId) => axiosInstance.put(`/users/resource/${resourceId}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries(["userResources", userData._id]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to like resource");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newResource.name || !newResource.link) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Validate URL format
    try {
      new URL(newResource.link);
    } catch (e) {
      toast.error("Please enter a valid URL");
      return;
    }
    
    addResource(newResource);
  };

  if (isLoading) return <div className="bg-white shadow rounded-lg p-6 mb-6">Loading resources...</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Resources & References</h2>
        {isOwnProfile && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center text-primary hover:text-primary-dark transition duration-300"
          >
            <Plus size={18} className="mr-1" />
            Add Resource
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Resource Name</label>
            <input
              type="text"
              value={newResource.name}
              onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="E.g., JavaScript Documentation"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Resource Link</label>
            <input
              type="text"
              value={newResource.link}
              onChange={(e) => setNewResource({ ...newResource, link: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="https://example.com"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300"
            >
              Add Resource
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {resources.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          {isOwnProfile 
            ? "You haven't added any resources yet. Add your first resource!" 
            : "This user hasn't added any resources yet."}
        </p>
      ) : (
        <ul className="divide-y">
          {resources.map((resource) => (
            <li key={resource._id} className="py-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{resource.name}</h3>
                  <a 
                    href={resource.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center text-sm"
                  >
                    <Link size={14} className="mr-1" />
                    {resource.link}
                  </a>
                </div>
                <div className="flex items-center">
                  <button 
                    onClick={() => toggleLike(resource._id)}
                    className={`flex items-center mr-2 ${
                        resource.likes.includes(authUser._id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    } transition duration-300`}
                  >
                    <Heart size={18} className={resource.likes.includes(authUser._id) ? 'fill-current' : ''} />
                    <span className="ml-1">{resource.likes.length}</span>
                  </button>
                  
                  {isOwnProfile && (
                    <button 
                      onClick={() => deleteResource(resource._id)}
                      className="text-gray-400 hover:text-red-500 transition duration-300"
                    >
                      <Trash size={18} />
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResourcesSection;
