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
  const { data, isLoading, error } = useFetch('/api/boardRoute', {
    headers: { Authorization: `Bearer ${user?.token}` },
  });

  useEffect(() => {
    if (data) {
      dispatch({ type: 'SET_BOARDS', payload: data });
    }
  }, [data, dispatch]);

  return (
    <div className='min-h-screen bg-slate-50 text-slate-950'>
      <Header />
      <main className='container mx-auto flex w-full flex-grow flex-col gap-8 py-6'>
        <section className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <h2 className='text-xl font-semibold text-slate-950'>Projects</h2>
            <p className='mt-1 text-sm text-slate-600'>
              Open a project to draw labels, save annotations, or invite
              reviewers.
            </p>
          </div>
          <NewBoard />
        </section>

        <section className='min-h-[360px]'>
          {isLoading ? (
            <div className='flex min-h-[360px] items-center justify-center rounded-lg border border-slate-200 bg-white'>
              <Loading />
            </div>
          ) : error ? (
            <div className='flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 px-6 text-center'>
              <div className='flex size-12 items-center justify-center rounded-full bg-red-100 text-red-600'>
                <i className='fa-solid fa-triangle-exclamation'></i>
              </div>
              <h3 className='mt-4 text-lg font-semibold text-red-950'>
                Could not load projects
              </h3>
              <p className='mt-2 max-w-md text-sm text-red-700'>
                {error.response?.data?.error ||
                  error.message ||
                  'Please refresh the page or try again later.'}
              </p>
            </div>
          ) : (
            <>
              {boards.length ? (
                <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3'>
                  {boards.map((board) => {
                    return <BoardCard board={board} key={board._id} />;
                  })}
                </div>
              ) : (
                <div className='flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-6 text-center'>
                  <div className='flex size-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600'>
                    <i className='fa-regular fa-images text-xl'></i>
                  </div>
                  <h3 className='mt-4 text-lg font-semibold text-slate-950'>
                    No projects yet
                  </h3>
                  <p className='mt-2 max-w-md text-sm leading-6 text-slate-600'>
                    Create your first segmentation project by uploading an image
                    and giving it a clear name.
                  </p>
                  <div className='mt-5'>
                    <NewBoard />
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default BoardPage;
