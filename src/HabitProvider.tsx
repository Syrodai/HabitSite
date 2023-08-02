import { useState, createContext, ReactNode } from 'react';
import { daysSince, getDay, today } from './date';

export enum HabitStatus { PENDING = 1, DONE = 2, FAILED = 3 }; // should not be changed once data becomes permanently stored

export interface Habit {
    id: number;
    description: string;
    startDate: string;
    history: HabitStatus[];
}

interface HabitContextType {
    habits: Habit[];
    setHabits: (habit: Habit[]) => void;
    fulfillHabit: (habit: Habit, date: string) => void;
    failHabit: (habit: Habit, date: string) => void;
    deleteHabit: (habit: Habit, askConfirmation?: boolean) => void;
    createHabit: (desc: string) => void;
    editHabit: (habit: Habit, newHabit: Habit) => void;
    getStatus: (habit: Habit, newHabit: Habit) => HabitStatus;
}

export const HabitContext = createContext<HabitContextType | null>(null);

const HabitProvider = ({ children }: { children: ReactNode }) => {
    // example data
    // set start dates to 5 days ago, 1 day ago, and just now
    const [habits, setHabits] = useState([
        {
            id: 1, description: "Exercise", startDate: getDay(-5).date,
            history: [HabitStatus.PENDING, HabitStatus.DONE, HabitStatus.DONE, HabitStatus.DONE, HabitStatus.FAILED, HabitStatus.DONE]
        },
        {
            id: 2, description: "Habit #2", startDate: getDay(-1).date,
            history: [HabitStatus.PENDING, HabitStatus.FAILED]
        },
        {
            id: 3, description: "Be good", startDate: today().date,
            history: [HabitStatus.PENDING]
        },
    ]);
    //
    
    // get status for a habit on a particular date
    const getStatus = (habit: Habit, date: string) => {
        return habit.history[daysSince(habit.startDate, date)]
    }

    // set status for a habit on a particular date
    const setStatus = (habit: Habit, date: string, status: HabitStatus) => {
        habit.history[daysSince(habit.startDate, date)] = status;

        // rerender
        const h = [...habits];
        setHabits(h);
    }

    // fulfill a habit on a particular date
    const fulfillHabit = (habit: Habit, date: string) => {
        if (getStatus(habit, date) === HabitStatus.DONE) return;
        //console.log(`Habit '${habit.description}' marked as fulfilled`);

        setStatus(habit, date, HabitStatus.DONE);
    }

    // fail a habit on a particular date
    const failHabit = (habit: Habit, date: string) => {
        if (getStatus(habit, date) === HabitStatus.FAILED) return;
        //console.log(`Habit '${habit.description}' marked as failed`);

        setStatus(habit, date, HabitStatus.FAILED);
    }

    // delete a habit, optionally ask for confirmation
    const deleteHabit = (habit: Habit, askConfirmation: boolean=false) => {
        const confirmationText = "Are you sure you want to delete '" + habit.description + "'?\n Your streak and history for this habit will be lost."
        if (askConfirmation && !window.confirm(confirmationText)) {
            return;
        } else {
            setHabits(habits.filter((h) => habit.id !== h.id));
        }
    }

    // create a new habit based on description
    const createHabit = (desc: string) => {
        // random id for now. Will be assigned by the backend later.
        setHabits([...habits, {
            id: Math.floor(Math.random() * 1000000) + 1,
            description: desc,
            startDate: today().date,
            history: [HabitStatus.PENDING],
        }]);
    }

    // replace an existing habit with a new one. Not used for updating historical status
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
            getStatus,
            habits,
            //setHabits,
        }}>
            {children}
        </HabitContext.Provider>
    )
}

export default HabitProvider;

