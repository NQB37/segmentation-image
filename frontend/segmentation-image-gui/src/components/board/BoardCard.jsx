import { useNavigate } from 'react-router-dom';
import DeleteBoard from './form/DeleteBoard';

const BoardCard = ({ board }) => {
    const navigate = useNavigate();
    const handleCardClick = () => {
        navigate(`/board/${board._id}`);
    };
    return (
        <div
            onClick={handleCardClick}
            className="col-span-2 bg-gray-300 p-4 rounded"
        >
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
                    <p>{board.membersId.length} members</p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <DeleteBoard _id={board._id} />
                </div>
            </div>
        </div>
    );
};

export default BoardCard;
