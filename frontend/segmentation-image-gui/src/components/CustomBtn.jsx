const CustomBtn = ({ icon, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="size-8 rounded bg-white border border-black hover:bg-gray-200 hover:border-gray-200"
        >
            <i className={icon}></i>
        </button>
    );
};

export default CustomBtn;
