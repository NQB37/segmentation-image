import { useNavigate } from 'react-router-dom';
import DeleteBoard from './form/DeleteBoard';

const BoardCard = ({ board }) => {
    const navigate = useNavigate();
    const handleCardClick = () => {
        navigate(`/board/${board._id}`);
    };

    const memberCount = board.membersId?.length || 0;
    const updatedAt = board.updatedAt
        ? new Date(board.updatedAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
          })
        : 'Not saved';

    return (
        <article
            onClick={handleCardClick}
            tabIndex="0"
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick();
                }
            }}
            className="group cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-200 hover:border-indigo-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                    src={board.image}
                    alt={board.title}
                    className="size-full object-contain object-center p-3 transition duration-200 group-hover:scale-[1.02]"
                />
                <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                    {memberCount} {memberCount === 1 ? 'member' : 'members'}
                </div>
            </div>
            <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="truncate text-base font-semibold text-slate-950">
                            {board.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Updated {updatedAt}
                        </p>
                    </div>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                    >
                        <DeleteBoard _id={board._id} />
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        <span className="size-2 rounded-full bg-emerald-500"></span>
                        Ready
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 transition duration-200 group-hover:text-indigo-700">
                        Open
                        <i className="fa-solid fa-arrow-right text-xs"></i>
                    </span>
                </div>
            </div>
        </article>
    );
};

export default BoardCard;
