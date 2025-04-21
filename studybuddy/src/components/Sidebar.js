import { Link } from "react-router-dom";
import { Home,  LogOut, LayoutDashboard } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

export default function Sidebar({ user }) {
	const queryClient = useQueryClient();
	
	const {mutate : logout} = useMutation({
		mutationFn : async () =>await axiosInstance.post('/auth/logout'),
		onSuccess: () => {
		  queryClient.invalidateQueries(['authUser']);
		},
	  })

	return (
		<div className='bg-secondary rounded-lg shadow ml-4'>
			<div className='p-4 text-center'>
				<div
					className='h-16 rounded-t-lg bg-cover bg-center'
					style={{
						backgroundImage: `url("${user.bannerImg || "/banner.png"}")`,
					}}
				/>
				<Link to={`/profile/${user.username}`}>
					<img
						src={user.profilePicture || "/avatar.png"}
						alt={user.name}
						className='w-20 h-20 rounded-full mx-auto mt-[-40px]'
					/>
					<h2 className='text-xl font-semibold mt-2'>{user.name}</h2>
				</Link>
				<p className='text-info'>{user.headline}</p>
				<p className='text-info text-xs'>{user.connections.length} connections</p>
			</div>
			<div className='border-t border-base-100 p-4'>
				<nav>
					<ul className='space-y-2'>
						<li>
							<Link
								to='/'
								className='flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors'
							>
								<Home className='mr-2' size={20} /> Home
							</Link>
						</li>
						<li>
							<Link
								to={`/${user.username}/dashoard`}
								className='flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors'
							>
								<LayoutDashboard className='mr-2' size={20} /> Dashboard
							</Link>
						</li>
						<li>
							<Link
								className='flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors'
								onClick={() => logout()}
							>
								<LogOut className='mr-2' size={20} /> Logout
							</Link>
						</li>
					</ul>
				</nav>
			</div>
			<div className='border-t border-base-100 p-4'>
				<Link to={`/profile/${user.username}`} className='text-sm font-semibold'>
					Visit your profile
				</Link>
			</div>
		</div>
	);
}
