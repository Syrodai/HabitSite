import { HStack, Box } from "@chakra-ui/react";
import { EditIcon, DeleteIcon, UnlockIcon, LockIcon } from "@chakra-ui/icons";
import { useContext, useState } from 'react';
import { HabitContext, Habit } from "../HabitProvider";
import "../App.css";

interface Props {
    habit: Habit;
    onEditClick: (habit: Habit) => void;
    isLocked: boolean;
    setLocked: (locked: boolean) => void;
}


// need to behave differently if the user is using a touch device
const QuickEditMenu = ({ habit, onEditClick, isLocked, setLocked }: Props) => {
    const { deleteHabit } = useContext(HabitContext)!;
    const [isMouseoverLockButton, setMouseOverLockButton] = useState(false);

    return (
        <HStack>
            <EditIcon className="icon-opacity" onClick={() => onEditClick(habit)} />
            <DeleteIcon className="icon-opacity" onClick={() => deleteHabit(habit, true)} />
            <Box onMouseOver={() => setMouseOverLockButton(true)} onMouseOut={() => setMouseOverLockButton(false)}>
                {isLocked ?
                    (isMouseoverLockButton ? <UnlockIcon className="icon-opacity" onClick={() => setLocked(false)} /> :
                        <LockIcon className="icon-opacity" /> )
                    :
                    (isMouseoverLockButton ? <LockIcon className="icon-opacity" onClick={() => setLocked(true)}/> :
                        <UnlockIcon className= "icon-opacity" /> )
                }
            </Box>
        </HStack>
    )
}

export default QuickEditMenu;