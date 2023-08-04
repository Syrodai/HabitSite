//import './App.css'
//import { useState } from 'react';
import HabitList from './components/HabitList';
import { Heading, Center } from '@chakra-ui/react';
import TopBar from './components/TopBar';
import Calendar from './components/Calendar';

function App() {
    

    //const [user, setUser] = useState("Sample User");
    const user = "Sample User";

    return (<>
        <TopBar username={user} />
        <Heading fontSize='5xl' marginBottom={5} marginTop={4}>Daily Habits</Heading>
        <Center><HabitList /></Center>
        <Calendar />
    </>)
}

export default App;
