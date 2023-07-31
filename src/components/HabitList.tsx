import { Button, List, ListItem, HStack, Text } from "@chakra-ui/react";
import { useState } from "react";
import QuickEditMenu from "./QuickEditMenu";
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
    const [hovered, setHovered] = useState<Habit | null>(null);

    return (
        <List>
            {habits.map((habit) =>
                <ListItem key={habit.id} onMouseOver={() => setHovered(habit)} onMouseOut={() => { if (hovered === habit) setHovered(null) }}>
                    <HStack>
                        {hovered===habit && <QuickEditMenu />}
                        <Text>{habit.description}</Text>
                        <Button colorScheme="green" variant={habit.status==="DONE" ? "solid": "outline"} size='lg' onClick={() => onHabitFulfilled(habit)}>Done!</Button>
                        <Button colorScheme="red" variant={habit.status === "FAILED" ? "solid" : "outline"} size='sm' onClick={() => onHabitFailed(habit)}>Missed</Button>
                    </HStack>
                </ListItem>
            )}
        </List>
    )
}

export default HabitList;