const BtnGray = ({ text, onClick, width }) => {
    return (
        <button
            onClick={onClick}
            className={`px-8 py-2 ${
                width ? width : 'w-full '
            } border border-transparent bg-gray-300 rounded hover:bg-gray-200 transition duration-300`}
        >
            {text}
        </button>
    );
};

export default BtnGray;
