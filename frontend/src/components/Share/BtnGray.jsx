const BtnGray = ({ text, onClick, width, disabled = false }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-8 py-2 ${
                width ? width : 'w-full '
            } border border-transparent bg-gray-300 rounded transition duration-300 ${
                disabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-gray-200'
            }`}
        >
            {text}
        </button>
    );
};

export default BtnGray;
