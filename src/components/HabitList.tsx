import { Button, List, ListItem, HStack, Text, Box, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState, useContext, useEffect, useRef } from "react";
import QuickEditMenu from "./QuickEditMenu";
import HabitCreator from "./HabitCreator";
import { Habit, HabitContext, HabitStatus } from "../HabitProvider";
import { today } from "../date";

const HabitList = () => {
    const [hovered, setHovered] = useState<Habit | null>(null);
    const [editing, setEditing] = useState<Habit | null>(null);
    const [newDescription, setNewDescription] = useState("");
    const { habits, fulfillHabit, failHabit, editHabit, getStatus } = useContext(HabitContext)!;

    // auto focus input
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => inputRef?.current?.focus(), [editing]);

    return (
        <div>
            <List>
                {habits.map((habit: Habit) =>
                    <ListItem key={habit.id} onMouseOver={() => setHovered(habit)} onMouseOut={() => { if (hovered === habit) setHovered(null) }}>
                        <HStack padding={1}>
                            <Box width={12}>{hovered === habit && <QuickEditMenu habit={habit} onEditClick={(habit: Habit) => {setEditing(habit); setNewDescription(habit.description)}}/>}</Box>
                            {editing === habit ?
                                <form onSubmit={(event) => { event.preventDefault(); editHabit(habit, { ...habit, description: newDescription }) }}>
                                    <InputGroup>
                                        <Input width={300} ref={inputRef} defaultValue={habit.description} onChange={(event) => setNewDescription(event.target.value)} />
                                        <InputRightElement>
                                            <Button colorScheme='blue' isDisabled={newDescription===""} type="submit">Save</Button>
                                        </InputRightElement>
                                    </InputGroup>
                                </form>
                            :
                                <Text width={300} >{habit.description}</Text>}
                            <Button colorScheme="green" variant={getStatus(habit, today().date) === HabitStatus.DONE ? "solid" : "outline"} size='lg' onClick={() => fulfillHabit(habit, today().date)}>Done!</Button>
                            <Button colorScheme="red" variant={getStatus(habit, today().date) === HabitStatus.FAILED ? "solid" : "outline"} size='sm' onClick={() => failHabit(habit, today().date)}>Missed</Button>
                        </HStack>
                    </ListItem>
                )}
            </List>
            <HabitCreator />
        </div>
    )
}

export default HabitList;