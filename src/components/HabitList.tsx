import { Button, List, ListItem } from "@chakra-ui/react";
//import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

export interface Habit {
    id: number;
    description: string;
    status: string;
}

interface Props {
    habits: Habit[];
    onHabitFulfilled: (habit: Habit) => void;
    onHabitFailed: (habit: Habit) => void;
}

const HabitList = ({ habits, onHabitFulfilled, onHabitFailed }: Props) => {
    return (
        <List>
            {habits.map((habit) =>
                <ListItem key={habit.id}>
                    {habit.description}
                    <Button colorScheme="green" variant={habit.status==="DONE" ? "solid": "outline"} size='lg' onClick={() => onHabitFulfilled(habit)}>Done!</Button>
                    <Button colorScheme="red" variant={habit.status === "FAILED" ? "solid" : "outline"} size='sm' onClick={() => onHabitFailed(habit)}>Missed</Button>
                </ListItem>
            )}
        </List>
    )
}

export default HabitList;