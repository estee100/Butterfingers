import React, { useState } from 'react';
import styles from './login.module.css';

const PasswordInput = ({ value, onChange, placeholder }) => {
    const [isShowPassword, setIsShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setIsShowPassword(!isShowPassword);
    };

    return (
        <div className={styles.passwordInputContainer}>
            <input
                value={value}
                onChange={onChange}
                type={isShowPassword ? "text" : "password"}
                placeholder={placeholder || "Password"}
                className={`${styles.passwordInput} ${isShowPassword ? styles.showPassword : ''}`}
            />
            <button
                type="button"
                onClick={toggleShowPassword}
                className={styles.toggleButton}
            >
                {isShowPassword ? "Hide" : "Show"}
            </button>
        </div>
    );
};

export default PasswordInput;
