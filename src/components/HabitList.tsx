import { Button, List, ListItem, HStack, Text, Box } from "@chakra-ui/react";
import { useState, useContext } from "react";
import QuickEditMenu from "./QuickEditMenu";
import HabitCreator from "./HabitCreator";
import  { Habit, HabitContext } from "../HabitProvider";

const HabitList = () => {
    const [hovered, setHovered] = useState<Habit | null>(null);
    const { habits, fulfillHabit, failHabit } = useContext(HabitContext)!;

    return (
        <div>
            <List>
                {habits.map((habit: Habit) =>
                    <ListItem key={habit.id} onMouseOver={() => setHovered(habit)} onMouseOut={() => { if (hovered === habit) setHovered(null) }}>
                        <HStack>
                            <Box width={10}>{hovered === habit && <QuickEditMenu habit={habit} />}</Box>
                            <Text width={300} >{habit.description}</Text>
                            <Button colorScheme="green" variant={habit.status==="DONE" ? "solid": "outline"} size='lg' onClick={() => fulfillHabit(habit)}>Done!</Button>
                            <Button colorScheme="red" variant={habit.status === "FAILED" ? "solid" : "outline"} size='sm' onClick={() => failHabit(habit)}>Missed</Button>
                        </HStack>
                    </ListItem>
                )}
            </List>
            <HabitCreator />
        </div>
    )
}

export default HabitList;