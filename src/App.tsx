//import './App.css'
//import { useState } from 'react';
import HabitList from './components/HabitList';
import { Heading, Box, HStack } from '@chakra-ui/react';
import TopBar from './components/TopBar';
import Calendar from './components/Calendar/Calendar';

function App() {
    

    //const [user, setUser] = useState("Sample User");
    const user = "Sample User";
    return (<>
        <TopBar username={user} />
        <Heading align="center" fontSize='5xl' marginBottom={5} marginTop={4}>Daily Habits</Heading>
        <HStack mb="2%">
            <Box ml="2%"><HabitList /></Box>
        </HStack>
        <Box width="50%" mb="50px"><Calendar /></Box>
    </>)
}

export default App;
