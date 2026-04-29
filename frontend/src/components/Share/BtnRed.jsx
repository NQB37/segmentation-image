const BtnRed = ({ text, onClick, width, disabled = false }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${
                width ? width : 'w-full '
            } h-11 px-2 border border-transparent bg-red-500 gap-0.5 transition duration-300 ${
                disabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-red-600'
            }`}
        >
            {text}
        </button>
    );
};

export default BtnRed;
