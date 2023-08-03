import { Button, List, ListItem, HStack, Text, Box, Input, InputGroup, InputRightElement, VStack, Center} from "@chakra-ui/react";
import { useState, useContext, useEffect, useRef } from "react";
import QuickEditMenu from "./QuickEditMenu";
import HabitCreator from "./HabitCreator";
import { Habit, HabitContext } from "../HabitProvider";
import { getDay, today, yesterday } from "../date";
import FulfillButtons from "./FulfillButtons";
import Streak from "./Streak";

const HabitList = () => {
    const [hovered, setHovered] = useState<Habit | null>(null);
    const [editing, setEditing] = useState<Habit | null>(null);
    const [newDescription, setNewDescription] = useState("");
    const { habits, editHabit } = useContext(HabitContext)!;

    // auto focus input
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => inputRef?.current?.focus(), [editing]);

    // spacing should be changed to be less repetitive
    return (
        <div>
            <HStack>
                <Text as='b' width={100}>{getDay(-2).dayOfWeek}</Text>
                <VStack spacing={0} width={100}>
                    <Text fontSize='20px' as='b'>Yesterday</Text>
                    <Text>({yesterday().dayOfWeek})</Text>
                </VStack>
                <VStack spacing={0} width={180}>
                    <Text fontSize='20px' as='b'>Today</Text>
                    <Text>({today().dayOfWeek})</Text>
                </VStack>
                <Text fontSize='20px' as='b' width={300}>Habit</Text>
            </HStack>
            <List>
                {habits.map((habit: Habit) =>
                    <ListItem key={habit.id} onMouseOver={() => setHovered(habit)} onMouseOut={() => { if (hovered === habit) setHovered(null) }}>
                        <HStack padding={1}>
                            <Box width={100}><FulfillButtons habit={habit} date={getDay(-2).date} bigButton={false} /></Box>
                            <Box width={100}><FulfillButtons habit={habit} date={yesterday().date} bigButton={false} /></Box>
                            <Box width={180}><FulfillButtons habit={habit} date={today().date} bigButton={true} /></Box>
                            <Box width={300}>{editing === habit ?
                                <form onSubmit={(event) => { event.preventDefault(); editHabit(habit, { ...habit, description: newDescription }) }}>
                                    <InputGroup>
                                        <Input ref={inputRef} defaultValue={habit.description} onChange={(event) => setNewDescription(event.target.value)} />
                                        <InputRightElement>
                                            <Button colorScheme='blue' isDisabled={newDescription === ""} type="submit">Save</Button>
                                        </InputRightElement>
                                    </InputGroup>
                                </form>
                                :
                                <Text >{habit.description}</Text>
                            }</Box>
                            <Streak habit={habit} />
                            <Box width={12}>{hovered === habit && <QuickEditMenu habit={habit} onEditClick={(habit: Habit) => { setEditing(habit); setNewDescription(habit.description) }} />}</Box>
                        </HStack>
                    </ListItem>
                )}
            </List>
            <Box width={625} ml={400}><HabitCreator /></Box>
        </div>
    )
}

export default HabitList;