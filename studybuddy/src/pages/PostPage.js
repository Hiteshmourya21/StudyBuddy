import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post/Post.js";
import { Loader } from "lucide-react";

const PostPage = () => {
	const { postId } = useParams();
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	const { data: post, isLoading } = useQuery({
		queryKey: ["post", postId],
		queryFn: () => axiosInstance.get(`/posts/${postId}`),
	});

	if (isLoading) return  <Loader size={18} className='animate-spin' />;
	if (!post?.data) return <div>Post not found</div>;

	return (
		<div className="min-h-screen bg-base-100">
        
        <div className="max-w-7xl mx-auto px-4 py-6">
			<div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
				<div className='hidden lg:block lg:col-span-1'>
					<Sidebar user={authUser} />
				</div>

				<div className='col-span-1 lg:col-span-3'>
					<Post post={post.data} />
				</div>
			</div>
        </div>
    	</div>
	);
};
export default PostPage;
