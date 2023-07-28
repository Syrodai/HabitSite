import { HStack, Button } from "@chakra-ui/react";

export interface Habit {
    id: number;
    description: string;
}

interface Props {
    habits: Habit[];
    onHabitFulfilled: (habit: Habit) => void;
    onHabitFailed: (habit: Habit) => void;
}

const HabitList = ({ habits, onHabitFulfilled, onHabitFailed }: Props) => {
    return (
        <ul>
            {habits.map((habit) =>
                <HStack key= { habit.id }>
                    <li >{habit.description}</li>
                    <Button onClick={() => onHabitFulfilled(habit)} />
                    <Button onClick={() => onHabitFailed(habit)} />
                </HStack>
            )}
        </ul>
    )
}

export default HabitList;