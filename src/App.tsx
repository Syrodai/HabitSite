import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Heading, Box, HStack } from '@chakra-ui/react';
import HabitList from './components/MainPage/HabitList';
import TopBar from './components/MainPage/TopBar';
import Calendar from './components/MainPage/Calendar/Calendar';
import MainPage from "./components/MainPage/MainPage";

const App = () => {
    //const [user, setUser] = useState("Sample User");
    const user = "Sample User";



    //<BrowserRouter>
    return (
        <MainPage user={user}/>
    )
}

export default App;
