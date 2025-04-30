const BtnMove = ({ moveSelected, handleMove }) => {
    return (
        <div className="relative">
            <button
                onClick={handleMove}
                className={`size-8 rounded bg-white border border-black hover:bg-gray-200 hover:border-gray-200 ${
                    moveSelected ? 'bg-gray-200 border-gray-200' : 'bg-white'
                }`}
                title="Move"
            >
                <i className="fa-solid fa-arrows-up-down-left-right"></i>
            </button>
        </div>
    );
};

export default BtnMove;
