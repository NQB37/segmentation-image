import DeleteBoard from './form/DeleteBoard';

const BoardCard = ({ board }) => {
    return (
        <div className="col-span-2 bg-gray-300 p-4 rounded">
            <div className="h-40 bg-gray-400 flex items-center justify-center">
                <img
                    src={board.image}
                    alt={board.title}
                    className="size-full object-contain object-center"
                />
            </div>
            <div className="mt-4 flex justify-between">
                <div className="flex flex-col justify-between items-start gap-2">
                    <span>{board.title}</span>
                    <div className="flex space-x-2">
                        <i className="fas fa-user text-purple-400"></i>
                        <i className="fas fa-user text-purple-400"></i>
                        <i className="fas fa-user text-purple-400"></i>
                    </div>
                </div>
                <DeleteBoard _id={board._id} />
            </div>
        </div>
    );
};

export default BoardCard;
