import { Button, List, ListItem, HStack, Text, Box, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState, useContext, useEffect, useRef } from "react";
import QuickEditMenu from "./QuickEditMenu";
import HabitCreator from "./HabitCreator";
import  { Habit, HabitContext } from "../HabitProvider";

const HabitList = () => {
    const [hovered, setHovered] = useState<Habit | null>(null);
    const [editing, setEditing] = useState<Habit | null>(null);
    const [newDescription, setNewDescription] = useState("");
    const { habits, fulfillHabit, failHabit, editHabit } = useContext(HabitContext)!;

    // auto focus input
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => inputRef?.current?.focus(), [editing]);

    return (
        <div>
            <List>
                {habits.map((habit: Habit) =>
                    <ListItem key={habit.id} onMouseOver={() => setHovered(habit)} onMouseOut={() => { if (hovered === habit) setHovered(null) }}>
                        <HStack>
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
/*
!creatingHabit ?
    <Button colorScheme="blue" variant="solid" size='sm' marginLeft={10} onClick={() => { setCreatingHabit(true); setHabitDescription("") }}>Create Habit</Button>
    :
    <form onSubmit={(event) => { event.preventDefault(); setCreatingHabit(false); createHabit(habitDescription) }}>
        <HStack marginLeft={10} marginBottom={2}>
            <Input ref={inputRef} width="50%" placeholder={placeholder} onChange={(event) => setHabitDescription(event.target.value)} />
            <CloseIcon className="icon-opacity" onClick={() => setCreatingHabit(false)} />
        </HStack>
        <Button isDisabled={habitDescription === ""} colorScheme="blue" variant="solid" size='sm' marginLeft={10} type="submit">Submit</Button>
    </form>
*/
export default HabitList;