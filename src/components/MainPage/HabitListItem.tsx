import { ListItem, HStack, Box, InputGroup, Input, InputRightElement, Button, Text } from "@chakra-ui/react";
import { SyntheticEvent, useContext, useEffect, useRef, useState } from "react";
import { getDay, today, yesterday } from "../../date";
import { Habit, HabitContext, HabitStatus } from "../../HabitProvider";
import FulfillButtons from "./FulfillButtons";
import QuickEditMenu from "./QuickEditMenu";
import Streak from "./Streak";

interface Props {
    habit: Habit;
    alwaysShowButtons: boolean;
    descriptionWidth: string;
    columnWidth: string;
    rowHeight: string;
}

const HabitListItem = ({ habit, alwaysShowButtons, descriptionWidth, columnWidth, rowHeight }: Props) => {
    const [isLocked, setLocked] = useState(true);
    const [editing, setEditing] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [newDescription, setNewDescription] = useState("");
    const { editHabit, getStatus } = useContext(HabitContext)!;

    // auto focus input
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => inputRef?.current?.focus(), [editing]);

    const onSubmit = (event: SyntheticEvent) => {
        event.preventDefault();
        editHabit(habit, { ...habit, description: newDescription })
        setEditing(false);
    }

    // spacing should be changed to be less repetitive
    return (
        <ListItem key={habit.id} onMouseOver={() => setHovered(true)} onMouseOut={() => setHovered(false)}>
            <HStack padding={1} height={rowHeight}>

                <Box width={columnWidth}><FulfillButtons alwaysShowButtons={alwaysShowButtons} habit={habit} date={getDay(-2).date} bigButton={false} isLocked={isLocked && getStatus(habit, getDay(-2).date) !== HabitStatus.PENDING} /></Box>

                <Box width={columnWidth}><FulfillButtons alwaysShowButtons={alwaysShowButtons} habit={habit} date={yesterday().date} bigButton={false} isLocked={isLocked && getStatus(habit, yesterday().date) !== HabitStatus.PENDING} /></Box>

                <Box width={columnWidth}><FulfillButtons alwaysShowButtons={alwaysShowButtons} habit={habit} date={today().date} bigButton={false} isLocked={isLocked && getStatus(habit, today().date) !== HabitStatus.PENDING} /></Box>

                <Box width={descriptionWidth}>{editing ?
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Input ref={inputRef} defaultValue={habit.description} onChange={(event) => setNewDescription(event.target.value)} />
                            <InputRightElement>
                                <Button colorScheme='blue' isDisabled={newDescription === ""} type="submit">Save</Button>
                            </InputRightElement>
                        </InputGroup>
                    </form>
                    :
                    <Text>{habit.description}</Text>
                }</Box>

                <Streak habit={habit} />

                <Box width={12}>{hovered && <QuickEditMenu habit={habit} onEditClick={(habit: Habit) => { setEditing(true); setNewDescription(habit.description) }} isLocked={isLocked} setLocked={setLocked} />}</Box>

            </HStack>
        </ListItem>
    )
}

export default HabitListItem;