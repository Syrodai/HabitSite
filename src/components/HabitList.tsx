import { Button, List, ListItem, HStack, Text, Box, Input } from "@chakra-ui/react";
import { useState } from "react";
import QuickEditMenu from "./QuickEditMenu";
import CreateHabit from "./CreateHabit";
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
    deleteHabit: (habit: Habit) => void;
}

const HabitList = ({ habits, onHabitFulfilled, onHabitFailed, deleteHabit }: Props) => {
    const [hovered, setHovered] = useState<Habit | null>(null);

    

    return (
        <div>
            <List>
                {habits.map((habit) =>
                    <ListItem key={habit.id} onMouseOver={() => setHovered(habit)} onMouseOut={() => { if (hovered === habit) setHovered(null) }}>
                        <HStack>
                            <Box width={10}>{hovered === habit && <QuickEditMenu habit={habit} onClickDelete={deleteHabit} />}</Box>
                            <Text width={300} >{habit.description}</Text>
                            <Button colorScheme="green" variant={habit.status==="DONE" ? "solid": "outline"} size='lg' onClick={() => onHabitFulfilled(habit)}>Done!</Button>
                            <Button colorScheme="red" variant={habit.status === "FAILED" ? "solid" : "outline"} size='sm' onClick={() => onHabitFailed(habit)}>Missed</Button>
                        </HStack>
                    </ListItem>
                )}
            </List>
            <CreateHabit />
        </div>
    )
}

export default HabitList;