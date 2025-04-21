import React, { useState } from 'react'
import styles from './Auth.module.css';
import { axiosInstance } from '../../lib/axios.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        studyField: ''
      });


    const queryClient = useQueryClient();
    // @ts-ignore
    const {mutate : signUpMutation , isLoading} = useMutation({
        mutationFn: async(data) => {
            const res = await axiosInstance.post("auth/signup", data);
            return res.data;
        },
        onSuccess:() =>{
            toast.success("Account Created Successfully");
            // @ts-ignore
            queryClient.invalidateQueries(['authUser']);
        },
        onError: (err)=>{
            // @ts-ignore
            toast.error(err.response.data.message || "Something went wrong")
        }
    });
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };


      const handleSubmit = async (e) => {
        e.preventDefault();
        // @ts-ignore
        signUpMutation(formData);
      };

  return (
    <div className={`${styles.formContainer} ${styles.signUp}`}>
            <form onSubmit={handleSubmit}>
                <h1>Create Account</h1>
                <div className={styles.socialIcons}>
                    <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
                    <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
                    <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
                    <a href="#" className="icon"><i className="fa-brands fa-linkedin-in"></i></a>
                </div>
                <span>or use your email for registration</span>
                <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                <input type="text" name="username" placeholder="Username" onChange={handleChange} required/>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required/>
                <div className={styles.customDropdown}>
                    <select name="studyField" onChange={handleChange} required>
                        <option value="">Select Field of Study</option>
                        <option value="upsc">Civil Services Examination (UPSC)</option>
                        <option value="xat">Xavier Admission Test (XAT)</option>
                        <option value="ies">Indian Economic Service Examination (IES)</option>
                        <option value="ssc">Staff Selection Commission (SSC)</option>
                        <option value="cat">Common Admission Test (CAT)</option>
                        <option value="clat">Common Law Admission Test (CLAT)</option>
                        <option value="cds">Combined Defence Services Examination (CDS)</option>
                        <option value="lsat">Law School Admission Test (LSAT)</option>
                        <option value="nda">National Defence Academy Examination (NDA)</option>
                        <option value="neet">National Eligibility Entrance Test (NEET)</option>
                        <option value="fci">Food Corporation of India Examination (FCI)</option>
                        <option value="ceed">Common Entrance Examination for Design (CEED)</option>
                        <option value="ibps_po">IBPS PO Examination</option>
                        <option value="sbi_po">State Bank of India - Probationary Officers</option>
                        <option value="jee">Joint Entrance Examination- Main and Advance (JEE)</option>
                        <option value="gate">Graduate Aptitude Test in Engineering (GATE)</option>
                    </select>
                </div>
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit" >Sign Up</button>
            </form>
    </div>
  )
}

export default Register