import React, { useEffect, useState } from 'react';
import styles from './Auth.module.css';
import { useLocation } from 'react-router-dom';
import Header from '../landing/Header';
import Footer from '../landing/Footer';
import Register from './Register';
import Login from './Login';

const Auth = () => {
    useEffect(() => {
        function initializeToggle() {
            // console.log(location.state)
            if (location.state.from === "signUp"){
                setToggle(`${styles.active}`) 
            }
            else{
                setToggle("")
            }
        }
        initializeToggle();
    })
    const location = useLocation();
    // console.log(location.state)
    const [toggle,setToggle] = useState("")

    const handleToggle = async () => {
        if (toggle === ""){
            setToggle(`${styles.active}`)
            location.state.from = "signUp"
        }
        else{
            setToggle("")
            location.state.from = "signIn"
        }
    }


  return (
    <>
    <Header/>
    <div className={styles.containerBody}>    
        <div className={`${styles.container} ${toggle} `} id="container">
        <Register/>
        <Login/>
        <div className={styles.toggleContainer}>
            <div className={styles.toggle}>
                <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
                    <h1>Welcome Back!</h1>
                    <p>Enter your personal details to use all of site features</p>
                    <button className={styles.hidden} id="login" onClick={handleToggle}>Sign In</button>
                </div>
                <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
                    <h1>Hello, Friend!</h1>
                    <p>Register with your personal details to use all of site features</p>
                    <button className={styles.hidden} id="register" onClick={handleToggle}>Sign Up</button>
                </div>
            </div>
        </div>
    </div>
    </div>
    <Footer/>
    </>
  )
}

export default Auth