import './App.css'
import HabitList, { Habit } from './components/HabitList';

function App() {
    const habits = [
        { id: 1, description: "Be good" },
        { id: 2, description: "Excercise" },
        { id: 3, description: "Habit #3" },
    ];

    const onHabitFulfilled = (habit: Habit) => {
        console.log(`Habit '${habit.description}' marked as fulfilled`);
    }

    const onHabitFailed = (habit: Habit) => {
        console.log(`Habit '${habit.description}' marked as failed`);
    }

    return (<>
        <HabitList habits={habits} onHabitFulfilled={onHabitFulfilled} onHabitFailed={onHabitFailed}/>
    </>)
}

export default App;
