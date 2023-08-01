//import './App.css'
//import { useState } from 'react';
import HabitList from './components/HabitList';
import { Heading } from '@chakra-ui/react';
import TopBar from './components/TopBar';

function App() {

    //const [user, setUser] = useState("Sample User");
    const user = "Sample User";

    return (<>
        <TopBar username={user} />
        <Heading fontSize='5xl'>Daily Habits</Heading>
        <HabitList />
    </>)
}

export default App;
