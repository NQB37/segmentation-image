const BtnBlue = ({ text, onClick, width }) => {
    return (
        <div
            onClick={onClick}
            className={`px-8 py-2 ${
                width ? width : 'w-fit '
            } border border-transparent bg-blue-500 text-white rounded cursor-pointer transition duration-300 hover:bg-blue-600`}
        >
            {text}
        </div>
    );
};

export default BtnBlue;
