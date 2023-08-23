import { useState, createContext, ReactNode } from 'react';
import { useAuthHeader } from 'react-auth-kit';
import { daysSince, today } from './date';
import { fetchData, updateServerData } from './services/account';
import { decryptData, encryptData } from './services/data';

export enum HabitStatus { PENDING = 1, DONE = 2, FAILED = 3 }; // should not be changed once data becomes permanently stored

export interface Habit {
    id: number;
    description: string;
    startDate: string;
    history: HabitStatus[];
}

interface HabitContextType {
    habits: Habit[];
    //setHabits: (habit: Habit[]) => void;
    fulfillHabit: (habit: Habit, date: string) => void;             
    failHabit: (habit: Habit, date: string) => void;                
    deleteHabit: (habit: Habit, askConfirmation?: boolean) => void; 
    createHabit: (desc: string) => void;                            
    editHabit: (habit: Habit, newHabit: Habit) => void;             
    getStatus: (habit: Habit, date: string) => HabitStatus;         
    loadHabits: () => { success: boolean, message: string };
    clearHabits: () => void;
}

export const HabitContext = createContext<HabitContextType | null>(null);

const HabitProvider = ({ children }: { children: ReactNode }) => {
    const authHeader = useAuthHeader()();
    // example data
    // set start dates to 5 days ago, 1 day ago, and just now
    const [habits, setHabits] = useState<Habit[]>([
        /*{
            id: 1, description: "Exercise", startDate: getDay(-5).date,
            history: [HabitStatus.DONE, HabitStatus.FAILED, HabitStatus.DONE, HabitStatus.DONE, HabitStatus.DONE, HabitStatus.PENDING]
        },
        {
            id: 2, description: "Habit #2", startDate: getDay(-1).date,
            history: [HabitStatus.FAILED, HabitStatus.PENDING]
        },
        {
            id: 3, description: "Be good", startDate: today().date,
            history: [HabitStatus.PENDING]
        },*/
    ]);
    //
    
    // get status for a habit on a particular date
    const getStatus = (habit: Habit, date: string) => {
        return habit.history[daysSince(habit.startDate, date)]
    }

    // set status for a habit on a particular date
    const setStatus = async (habit: Habit, date: string, status: HabitStatus) => {
        habit.history[daysSince(habit.startDate, date)] = status;

        const newData = [...habits];

        const encrypted = encryptData(newData);

        const response = (await updateServerData(encrypted, authHeader)).data;
        if (!response)
            console.log("Set status failed: No response from server");

        if (response.success) {
            setHabits(newData);
        } else {
            console.log("Set status failed: " + response.message);
        }
    }

    // fulfill a habit on a particular date
    const fulfillHabit = async (habit: Habit, date: string) => {
        if (getStatus(habit, date) === HabitStatus.DONE) return;

        await setStatus(habit, date, HabitStatus.DONE);
    }

    // fail a habit on a particular date
    const failHabit = async (habit: Habit, date: string) => {
        if (getStatus(habit, date) === HabitStatus.FAILED) return;

        await setStatus(habit, date, HabitStatus.FAILED);
    }

    // delete a habit, optionally ask for confirmation
    const deleteHabit = async (habit: Habit, askConfirmation: boolean=false) => {
        const confirmationText = "Are you sure you want to delete '" + habit.description + "'?\n Your streak and history for this habit will be lost."
        if (askConfirmation && !window.confirm(confirmationText)) {
            return;
        } else {
            const newData = habits.filter((h) => habit.id !== h.id);
            const encrypted = encryptData(newData);

            const response = (await updateServerData(encrypted, authHeader)).data;
            if (!response)
                console.log("Delete habit failed: No response from server");

            if (response.success) {
                setHabits(newData);
            } else {
                console.log("Delete habit failed: " + response.message);
            }
        }
    }

    // create a new habit based on description
    const createHabit = async (desc: string) => {
        // create random id
        let Id = 0;
        let loop = true;
        while (loop === true) {
            Id = Math.floor(Math.random() * 10000000) + 1;
            loop = false;
            for (let i = 0; i < habits.length; i++) {
                if (habits[i].id === Id) {
                    loop = true;
                    break;
                }  
            }
        }

        const newData = [...habits, {
            id: Id,
            description: desc,
            startDate: today().date,
            history: [HabitStatus.PENDING],
        }];
        const encrypted = encryptData(newData);

        const response = (await updateServerData(encrypted, authHeader)).data;
        if (!response)
            console.log("Create habit failed: No response from server");

        if (response.success) {
            setHabits(newData);
        } else {
            console.log("Create habit failed: " + response.message);
        }
    }

    // replace an existing habit with a new one. Not used for updating historical status
    const editHabit = async (habit: Habit, newHabit: Habit) => {
        const newData = habits.map((h: Habit) => h.id === habit.id ? newHabit : h);

        const encrypted = encryptData(newData);

        const response = (await updateServerData(encrypted, authHeader)).data;

        if (!response)
            console.log("Edit habit failed: No response from server");

        if (response.success) {
            setHabits(newData);
        } else {
            console.log("Edit habit failed: " + response.message);
        }
    }

    // fetch all habits for this user from the server
    const loadHabits = async () => {
        const response = await fetchData(authHeader);
        
        if (!response) {
            console.log("Load habits failed: No response from server");
            return { success: false, message: "No response from server" }
        }
        
        if (!response.success) {
            console.log("Load habits failed: " + response.message);
            return response;
        }

        if (response.success) {
            try {
                const dataString = response.data[0].data;
                if (dataString === " ") {
                    setHabits([]);
                } else {
                    const data = decryptData(dataString);
                    setHabits(data);
                }
                return { success: true, message: "Habits set" };
            } catch (err) {
                return { success: false, message: "Error decrypting habits" };
            }
        } else {
            return { success: true, message: "Error retrieving habits" };
        }
    }

    // set habits to empty for when signing out
    const clearHabits = () => {
        setHabits([]);
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
            loadHabits,
            clearHabits,
            //setHabits,
        }}>
            {children}
        </HabitContext.Provider>
    )
}

export default HabitProvider;
