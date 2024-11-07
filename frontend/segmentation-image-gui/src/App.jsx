import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CanvasProvider } from './hooks/useCanvasContext';
import WorkplacePage from './pages/Workplace';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
function App() {
    return (
        <CanvasProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<WorkplacePage />}></Route>
                    <Route path="/login" element={<LoginPage />}></Route>
                    <Route path="/signup" element={<SignupPage />}></Route>
                </Routes>
            </Router>
        </CanvasProvider>
    );
}

export default App;
