const BtnRed = ({ text, onClick, width }) => {
    return (
        <button
            onClick={onClick}
            className={`${
                width ? width : 'w-full '
            } h-11 px-2 border border-transparent bg-red-500 gap-0.5 hover:bg-red-600 transition duration-300`}
        >
            {text}
        </button>
    );
};

export default BtnRed;
