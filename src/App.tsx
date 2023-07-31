//import './App.css'
import { useState } from 'react';
import HabitList, { Habit } from './components/HabitList';
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

    return (<>
        <TopBar username={user}/>
        <HabitList habits={habits} onHabitFulfilled={onHabitFulfilled} onHabitFailed={onHabitFailed} />
    </>)
}

export default App;
