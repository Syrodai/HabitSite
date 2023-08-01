import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import HabitProvider from './HabitProvider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ChakraProvider>
            <HabitProvider>
                <App />
            </HabitProvider>
        </ChakraProvider>
    </React.StrictMode>,
)