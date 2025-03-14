import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    createBrowserRouter,
} from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import { CanvasProvider } from './hooks/useCanvasContext';
import WorkplacePage from './pages/Workplace';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import BoardPage from './pages/Board';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BoardContextProvider } from './context/BoardContext';
import ErrorPage from './pages/Error';
import ProfilePage from './pages/Profile';
function App() {
    const { user } = useAuthContext();
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
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={
                            !user ? (
                                <CanvasProvider>
                                    <WorkplacePage />
                                </CanvasProvider>
                            ) : (
                                <Navigate to="/board" />
                            )
                        }
                    ></Route>
                    <Route
                        path="/board/:id"
                        element={
                            user ? (
                                <CanvasProvider>
                                    <WorkplacePage />
                                </CanvasProvider>
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    ></Route>
                    <Route
                        path="/board"
                        element={
                            user ? (
                                <BoardContextProvider>
                                    <BoardPage />
                                </BoardContextProvider>
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    ></Route>
                    <Route
                        path="/login"
                        element={
                            !user ? <LoginPage /> : <Navigate to="/board" />
                        }
                    ></Route>
                    <Route
                        path="/signup"
                        element={
                            !user ? <SignupPage /> : <Navigate to="/board" />
                        }
                    ></Route>
                    <Route
                        path="/profile"
                        element={
                            <BoardContextProvider>
                                <ProfilePage />
                            </BoardContextProvider>
                        }
                    ></Route>
                </Routes>
            </Router>
        </>
    );
}

export default App;
