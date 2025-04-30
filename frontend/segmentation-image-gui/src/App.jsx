import {
    Navigate,
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import { CanvasProvider } from './hooks/useCanvasContext';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import BoardPage from './pages/Board';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BoardContextProvider } from './context/BoardContext';
import ErrorPage from './pages/Error';
import ProfilePage from './pages/Profile';
import BoardDetailPage from './pages/BoardDetail';
function App() {
    const { user } = useAuthContext();
    const router = createBrowserRouter([
        {
            path: '/',
            element: user ? (
                <BoardContextProvider>
                    <BoardPage />
                </BoardContextProvider>
            ) : (
                <Navigate to="/login" />
            ),
            errorElement: <ErrorPage />,
        },
        {
            path: '/board',
            element: user ? (
                <BoardContextProvider>
                    <BoardPage />
                </BoardContextProvider>
            ) : (
                <Navigate to="/login" />
            ),
            errorElement: <ErrorPage />,
        },
        {
            path: '/board/:id',
            element: user ? (
                <BoardContextProvider>
                    <CanvasProvider>
                        <BoardDetailPage />
                    </CanvasProvider>
                </BoardContextProvider>
            ) : (
                <Navigate to="/login" />
            ),
            errorElement: <ErrorPage />,
        },
        {
            path: '/login',
            element: !user ? <LoginPage /> : <Navigate to="/board" />,
            errorElement: <ErrorPage />,
        },
        {
            path: '/signup',
            element: !user ? <SignupPage /> : <Navigate to="/board" />,
            errorElement: <ErrorPage />,
        },
        {
            path: '/profile',
            element: user ? (
                <BoardContextProvider>
                    <ProfilePage />
                </BoardContextProvider>
            ) : (
                <Navigate to="/login" />
            ),
            errorElement: <ErrorPage />,
        },
        {
            path: '*',
            element: <ErrorPage />,
        },
    ]);
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <RouterProvider router={router} />
        </>
    );
}

export default App;
