import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("student");

  // Fetch search results based on category & query
  const { data: results, isLoading, isError } = useQuery({
    queryKey: ["searchResults", category, query],
    queryFn: async () => {
      if (!query) return [];
      
      try { 
        const response = await axiosInstance.get(`/users/query/search`, {
          params: { category, q: query },
        });
        return response.data;
      } catch (error) {
        console.error("API Call Failed:", error.response?.data || error.message);
        throw error;
      }
    },
    enabled: !!query,
  });
  

  return (
    <div className="flex flex-col items-center w-full p-6">
      <div className="flex items-center w-3/4 border rounded-lg shadow-md overflow-hidden">
        <select
          className="p-3 bg-gray-200 border-r outline-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="post">Post</option>
          <option value="forum">Forum</option>
          <option value="groups">Groups</option>
        </select>
        <input
          type="text"
          className="flex-grow p-3 outline-none"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Search Results */}
      <div className="mt-4 w-3/4">
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error fetching results</p>}
        {results && results.length > 0 ? (
          <ul className="bg-white shadow rounded-lg">

            {category === "student" && results.map((item, index) => (
              <li key={index} className="p-3 border-b last:border-none">
                <Link to={`/profile/${item.username}`}>
                  <div className="flex items-center">
                    <img
                      src={item.profilePicture || "/avatar.png"}
                      alt={item.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.headline}</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}

            {category === "post" && results.map((item, index) => (
              <li key={index} className="p-3 border-b last:border-none">
                <Link to={`/post/${item._id}`}>
                  <div className="flex items-center">
                    <img
                      src={item.author.profilePicture || "/avatar.png"}
                      alt={item.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold">{item.content}</h3>
                      <p className="text-sm text-gray-600">{item.author.name}</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}

            {category === "forum" && results.map((item, index) => (
              <li key={index} className="p-3 border-b last:border-none">
                <Link to={`/forum/question/${item._id}`}>
                  <div className="flex items-center">
                    <img
                      src={item.user.profilePicture || "/avatar.png"}
                      alt={item.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.user.name}</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}

            {category === "groups" && results.map((item, index) => (
              <li key={index} className="p-3 border-b last:border-none">
                <Link to={`/groups/${item._id}`}>
                  <div className="flex items-center">
                    <div className="ml-3 ">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-sm text-gray-600">{item.members.length} members</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : query && !isLoading ? (
          <p>No results found</p>
        ) : null}
      </div>
    </div>
  );
};

export default Search;