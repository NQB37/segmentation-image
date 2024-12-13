const BtnGreen = ({ text, onClick, width }) => {
    return (
        <button
            onClick={onClick}
            className={`${
                width ? width : 'w-full '
            } h-11 px-2 border border-transparent bg-green-400 gap-0.5 hover:bg-green-500 transition duration-300`}
        >
            {text}
        </button>
    );
};

export default BtnGreen;
