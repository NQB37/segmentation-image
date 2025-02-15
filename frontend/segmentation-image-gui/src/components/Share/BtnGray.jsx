const BtnGray = ({ text, onClick, width }) => {
    return (
        <button
            onClick={onClick}
            className={`${
                width ? width : 'w-full '
            } h-11 px-2 border border-transparent bg-gray-300 gap-0.5 rounded hover:bg-gray-200 transition duration-300`}
        >
            {text}
        </button>
    );
};

export default BtnGray;
