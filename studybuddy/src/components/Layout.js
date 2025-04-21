import { useQuery } from "@tanstack/react-query";
import NavBar from "./NavBar/NavBar";

const Layout = ({children}) => {
  const {data:authUser} = useQuery({queryKey:['authUser']});
  return (
    <div className="min-h-screen bg-base-100">
        {authUser && <NavBar/>}
        <main className="max-w-7xl mx-auto px-4 py-6">
            {children}
        </main>
    </div>
  )
}

export default Layout