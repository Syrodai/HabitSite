import { useState, createContext, ReactNode } from 'react';

export enum HabitStatus { PENDING = 1, DONE = 2, FAILED = 3 }; // should not be changed once data becomes permanently stored

export interface Habit {
    id: number;
    description: string;
    status: HabitStatus;
}

interface HabitContextType {
    habits: Habit[];
    setHabits: (habit: Habit[]) => void;
    fulfillHabit: (habit: Habit) => void;
    failHabit: (habit: Habit) => void;
    deleteHabit: (habit: Habit, askConfirmation?: boolean) => void;
    createHabit: (desc: string) => void;
    editHabit: (habit: Habit, newHabit: Habit) => void;
}

export const HabitContext = createContext<HabitContextType | null>(null);

const HabitProvider = ({ children }: { children: ReactNode }) => {
    const [habits, setHabits] = useState([
        { id: 1, description: "Be good", status: HabitStatus.PENDING },
        { id: 2, description: "Exercise", status: HabitStatus.DONE },
        { id: 3, description: "Habit #3", status: HabitStatus.FAILED },
    ]);
    // habit start date
    // calendar status history array

    const fulfillHabit = (habit: Habit) => {
        if (habit.status === HabitStatus.DONE) return;
        console.log(`Habit '${habit.description}' marked as fulfilled`);
        editHabit(habit, { ...habit, status: HabitStatus.DONE })
    }
    const failHabit = (habit: Habit) => {
        if (habit.status === HabitStatus.FAILED) return;
        console.log(`Habit '${habit.description}' marked as failed`);
        editHabit(habit, { ...habit, status: HabitStatus.FAILED })
    }
    const deleteHabit = (habit: Habit, askConfirmation: boolean=false) => {
        const confirmationText = "Are you sure you want to delete '" + habit.description + "'?\n Your streak and history for this habit will be lost."
        if (askConfirmation && !window.confirm(confirmationText)) {
            return;
        } else {
            setHabits(habits.filter((h) => habit.id !== h.id));
        }
    }
    const createHabit = (desc: string) => {
        // random id for now. Will be assigned by the backend later.
        setHabits([...habits, {
            id: Math.floor(Math.random() * 1000000) + 1,
            description: desc,
            status: HabitStatus.PENDING,
        }]);
    }
    const editHabit = (habit: Habit, newHabit: Habit) => {
        setHabits(habits.map((h: Habit) => h.id === habit.id ? newHabit : h));
    }
    
    return (
        <HabitContext.Provider value={{
            fulfillHabit,
            failHabit,
            deleteHabit,
            createHabit,
            editHabit,
            habits,
            setHabits,
        }}>
            {children}
        </HabitContext.Provider>
    )
}

export default HabitProvider;

