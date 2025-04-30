import BoardCard from '../components/board/BoardCard';
import NewBoard from '../components/board/form/NewBoard';
import { useEffect } from 'react';
import { useBoardContext } from '../hooks/useBoardContext';
import { useAuthContext } from '../hooks/useAuthContext';
import Header from '../components/Share/Header';
import useFetch from '../hooks/useFetch';
import Loading from '../components/Share/Loading';

const BoardPage = () => {
    const { boards, dispatch } = useBoardContext();
    const { user } = useAuthContext();
    const { data, isLoading, error } = useFetch(
        'http://localhost:3700/api/boardRoute',
        {
            headers: { Authorization: `Bearer ${user?.token}` },
        },
    );
    useEffect(() => {
        if (data) {
            dispatch({ type: 'SET_BOARDS', payload: data });
        }
        console.log('Finish loading board');
    }, [data, dispatch]);

    return (
        <div className="flex flex-col min-h-screen">
            <div>
                <Header />
            </div>
            <main className="size-full flex-grow p-8">
                <div className="flex justify-between items-center pb-4 mb-8 border-b border-black">
                    <h1 className="text-3xl font-bold">Project</h1>
                    <NewBoard />
                </div>
                <div className="size-full">
                    {isLoading ? (
                        <Loading />
                    ) : (
                        <>
                            {boards.length ? (
                                <div className="grid grid-cols-12 gap-4">
                                    {boards.map((board) => {
                                        return (
                                            <BoardCard
                                                board={board}
                                                key={board._id}
                                            />
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="size-full flex items-center justify-center">
                                    <p>There is no project.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default BoardPage;
