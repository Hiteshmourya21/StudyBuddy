import React, { useState } from 'react';
import styles from './Auth.module.css';
import { axiosInstance } from '../../lib/axios.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const queryClient = useQueryClient();

    // @ts-ignore
    const {mutate : loginMutation, isLoading} = useMutation({
        mutationFn: (userData) => axiosInstance.post('/auth/login', userData),
        onSuccess: () => {
            // @ts-ignore
            toast.success("Logged In Successfully");
            queryClient.invalidateQueries(['authUser']);
        },
        onError: (err) => {
            // @ts-ignore
            toast.error(err.response.data.message || "Something went wrong");
            }
    })


    const handleSubmit = async (e) => {
        e.preventDefault();
        // @ts-ignore
        loginMutation({email, password});
    }

    return (
        <div className={`${styles.formContainer} ${styles.signIn}`}>
        <form onSubmit={handleSubmit}>
            <h1>Sign In</h1>
            <div className={styles.socialIcons}>
                <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
                <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
                <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
                <a href="#" className="icon"><i className="fa-brands fa-linkedin-in"></i></a>
            </div>
            <span>or use your email password</span>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
             <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
            <a href="#">Forget Your Password?</a>
            <button type="submit">{isLoading ? <Loader className='size-5 animate-spin' /> : "Login"}</button>
        </form>
    </div>
    )
}

export default Login