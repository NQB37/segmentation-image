const BtnGreen = ({ text, onClick, width, disabled = false }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${
                width ? width : 'w-full '
            } h-11 px-2 border border-transparent bg-green-400 gap-0.5 rounded transition duration-300 ${
                disabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-green-500'
            }`}
        >
            {text}
        </button>
    );
};

export default BtnGreen;
