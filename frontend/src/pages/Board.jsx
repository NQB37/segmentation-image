import BoardCard from '../components/board/BoardCard';
import NewBoard from '../components/board/form/NewBoard';
import { useEffect } from 'react';
import { useBoardStore } from '../stores/useBoardStore';
import { useAuthStore } from '../stores/useAuthStore';
import Header from '../components/Share/Header';
import useFetch from '../hooks/useFetch';
import Loading from '../components/Share/Loading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle, Images } from 'lucide-react';

const BoardPage = () => {
  const boards = useBoardStore((state) => state.boards);
  const setBoards = useBoardStore((state) => state.setBoards);
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, error } = useFetch('/api/boardRoute', {
    headers: { Authorization: `Bearer ${user?.token}` },
  });

  useEffect(() => {
    if (data) {
      setBoards(data);
    }
  }, [data, setBoards]);

  return (
    <div className='min-h-screen bg-background text-foreground'>
      <Header />
      <main className='container mx-auto flex w-full grow flex-col gap-6  py-6'>
        <section className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <h1 className='text-2xl font-semibold tracking-tight'>Projects</h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              Open a project to draw labels, save annotations, or invite
              reviewers.
            </p>
          </div>
          <NewBoard />
        </section>

        <section className='min-h-[360px]'>
          {isLoading ? (
            <Card className='min-h-[360px] justify-center'>
              <CardContent className='flex items-center justify-center'>
                <Loading />
              </CardContent>
            </Card>
          ) : error ? (
            <Alert variant='destructive' className='min-h-36'>
              <AlertTriangle className='size-4' />
              <AlertTitle>Could not load projects</AlertTitle>
              <AlertDescription>
                {error.response?.data?.error ||
                  error.message ||
                  'Please refresh the page or try again later.'}
              </AlertDescription>
            </Alert>
          ) : boards.length ? (
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3'>
              {boards.map((board) => {
                return <BoardCard board={board} key={board._id} />;
              })}
            </div>
          ) : (
            <Card className='min-h-[360px] items-center justify-center border-dashed text-center'>
              <CardHeader className='items-center'>
                <div className='flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                  <Images className='size-5' />
                </div>
                <CardTitle>No projects yet</CardTitle>
                <CardDescription className='max-w-md'>
                  Create your first segmentation project by uploading an image
                  and giving it a clear name.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NewBoard />
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
};

export default BoardPage;
