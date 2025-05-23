import { useState } from 'react';

const BtnVisible = ({ state, onClick }) => {
    const [isVisible, setIsVisible] = useState(state);
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
