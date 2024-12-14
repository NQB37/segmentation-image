import BoardCard from '../components/board/BoardCard';
import NewBoard from '../components/board/form/NewBoard';
import { useEffect } from 'react';
import { useBoardContext } from '../hooks/useBoardContext';
import { useAuthContext } from '../hooks/useAuthContext';
import Header from '../components/Share/Header';

const BoardPage = () => {
    const { boards, dispatch } = useBoardContext();
    const { user } = useAuthContext();
    useEffect(() => {
        const fetchBoards = async () => {
            const res = await fetch('http://localhost:3700/api/boardRoute', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const json = await res.json();
            if (res.ok) {
                // setBoards(json);
                dispatch({ type: 'SET_BOARDS', payload: json });
            }
        };
        if (user) {
            fetchBoards();
        }
    }, [dispatch, user]);
    return (
        <div className="min-h-screen">
            <Header />
            <main className="p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Project</h1>
                    <NewBoard />
                </div>
                <div className="h-full">
                    {boards ? (
                        <div className="grid grid-cols-12 gap-4">
                            {boards.map((board) => {
                                return (
                                    <BoardCard board={board} key={board._id} />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="size-full flex items-center justify-center">
                            <p>There is no project.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default BoardPage;
