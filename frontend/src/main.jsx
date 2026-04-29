import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App.jsx';
import { AuthContextProvider } from './context/AuthContext';
import { TooltipProvider } from './components/ui/tooltip';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthContextProvider>
            <TooltipProvider>
                <App />
            </TooltipProvider>
        </AuthContextProvider>
    </StrictMode>,
);
