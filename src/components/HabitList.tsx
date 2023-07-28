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
                <li key={habit.id}>
                    {habit.description}
                    <Button colorScheme="green" variant="outline" size='md' onClick={() => onHabitFulfilled(habit)} />
                    <Button colorScheme="red" variant="outline" size='sm' onClick={() => onHabitFailed(habit)} />
                </li>
            )}
        </ul>
    )
}

export default HabitList;