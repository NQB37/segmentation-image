const CustomZoom = ({ value, onChange }) => {
    return (
        <div className="">
            <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                className="w-[400px]"
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default CustomZoom;
