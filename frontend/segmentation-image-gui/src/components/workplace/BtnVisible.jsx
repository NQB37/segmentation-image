import { useState } from 'react';

const BtnVisible = ({ onClick }) => {
    const [isVisible, setIsVisible] = useState(true);
    const handleClick = () => {
        setIsVisible(!isVisible);
        onClick();
    };
    return (
        <button onClick={handleClick}>
            {isVisible ? (
                <i className="fa-solid fa-eye"></i>
            ) : (
                <i className="fa-solid fa-eye-slash"></i>
            )}
        </button>
    );
};

export default BtnVisible;
