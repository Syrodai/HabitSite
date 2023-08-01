//import './App.css'
import { useState } from 'react';
import HabitList, { Habit } from './components/HabitList';
import { Heading } from '@chakra-ui/react';
import TopBar from './components/TopBar';

function App() {
    const [habits, setHabits] = useState([
        { id: 1, description: "Be good", status: "" },
        { id: 2, description: "Exercise", status: "DONE" },
        { id: 3, description: "Habit #3", status: "FAILED" },
    ]);
    // habit start date
    // calendar status history array

    const [user, setUser] = useState("Sample User");
    
    const onHabitFulfilled = (habit: Habit) => {
        if (habit.status === "DONE") return;
        console.log(`Habit '${habit.description}' marked as fulfilled`);
        setHabits(habits.map((h: Habit) => h.id === habit.id ? { ...h, status: "DONE" } : h));
    }
    const onHabitFailed = (habit: Habit) => {
        if (habit.status === "FAILED") return;
        console.log(`Habit '${habit.description}' marked as failed`);
        setHabits(habits.map((h: Habit) => h.id === habit.id ? { ...h, status: "FAILED" } : h));
    }
    const deleteHabit = (habit: Habit) => {
        setHabits(habits.filter((h) => habit.id !== h.id));
    }
    const createHabit = (desc: string) => {
        // random id for now. Will be assigned by the backend later.
        setHabits([...habits, {
            id: Math.floor(Math.random() * 1000000) + 1,
            description: desc,
            status: "",
        }]);
    }

    return (<>
        <TopBar username={user} />
        <Heading fontSize='5xl'>Daily Habits</Heading>
        <HabitList habits={habits} onHabitFulfilled={onHabitFulfilled} onHabitFailed={onHabitFailed} deleteHabit={deleteHabit} createHabit={createHabit} />
    </>)
}

export default App;
