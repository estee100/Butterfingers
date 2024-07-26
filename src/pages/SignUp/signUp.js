import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PasswordInput from '../../pages/Login/passwordInput';
import styles from '../../pages/Login/login.module.css';
import { validateEmail } from "../../utils/helper";
import axiosInstance from '../../utils/axiosInstance';

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();

        if(!name) {
            setError("Please enter your name.");
            return;
        }

        if(!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!password) {
            setError("Please enter the password.");
            return;
        }

        try {
            const response = await axiosInstance.post("/create-account", {
                fullName: name,
                email: email,
                password: password
            });

            if (response.data.error) {
                setError(response.data.message);
                setSuccessMessage("");
            } else {
                setSuccessMessage("Account created successfully! Proceed to login page.");
                setError(null);
            }
        } catch (error) {
            console.error("Error signing up:", error);
            setError("An unexpected error occurred. Please try again.");
            setSuccessMessage("");
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSignUp} className={styles.form}>
                <h4 className={`${styles.text2xl} ${styles.mb7}`}>Sign Up</h4>
                <input 
                    type="text" 
                    placeholder="Name" 
                    className={styles.inputBox} 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input 
                    type="text" 
                    placeholder="Email" 
                    className={styles.inputBox} 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <PasswordInput 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className={`${styles.errorText}`}>{error}</p>}
                {successMessage && <p className={`${styles.successText}`}>{successMessage}</p>}

                <button type="submit" className={styles.btnPrimary}>Create Account</button>

                <p className={`${styles.textSm} ${styles.textCenter} ${styles.mt4}`}>
                    Already have an account?{" "}
                    <Link to="/login" className={`${styles.fontMedium} ${styles.textPrimary} ${styles.underline}`}>
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default SignUp;