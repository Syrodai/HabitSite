import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from "react-auth-kit";
import App from './App.tsx'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import HabitProvider from './HabitProvider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ChakraProvider>
            <AuthProvider
                authType={"cookie"}
                authName={"_auth"}
                cookieDomain={window.location.hostname}
                cookieSecure={false} // temporarily false. Set to true for https
            >
                <HabitProvider>
                    <App />
                </HabitProvider>
            </AuthProvider>
        </ChakraProvider>
    </React.StrictMode>,
)