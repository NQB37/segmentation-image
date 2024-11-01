const CustomBtn = ({ icon, onClick, isClick }) => {
    return (
        <button
            onClick={onClick}
            className={`size-8 rounded bg-white border border-black hover:bg-gray-200 hover:border-gray-200 ${
                isClick ? 'bg-gray-200 border-gray-200' : 'bg-white'
            }`}
        >
            <i className={icon}></i>
        </button>
    );
};

export default CustomBtn;
