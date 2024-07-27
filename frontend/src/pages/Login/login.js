import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import PasswordInput from './passwordInput';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!password) {
            setError("Please enter the password");
            return;
        }
        
        setError("");

        try {
            const response = await axiosInstance.post("/login", {
                email: email,
                password: password,
            });

            if (response.data && response.data.accessToken) {
                localStorage.setItem("accessToken", response.data.accessToken);
                navigate('/');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred. Please try again");
            }
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleLogin} className={styles.form}>
                <h4 className={`${styles.text2xl} ${styles.mb7}`}>Login</h4>
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

                <button type="submit" className={styles.btnPrimary}>Login</button>
                <p className={`${styles.textSm} ${styles.textCenter} ${styles.mt4}`}>
                    Not Registered yet?{' '}
                    <Link to="/signUp" className={`${styles.fontMedium} ${styles.textPrimary} ${styles.underline}`}>
                        Create an Account
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
