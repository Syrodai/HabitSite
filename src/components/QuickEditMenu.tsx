import { HStack } from "@chakra-ui/react";
import { EditIcon, DeleteIcon, UnlockIcon, LockIcon } from "@chakra-ui/icons";
import { useContext } from 'react';
import { HabitContext, Habit } from "../HabitProvider";
import "../App.css";

interface Props {
    habit: Habit;
    onEditClick: (habit: Habit) => void;
    isLocked: boolean;
    setLocked: (locked: boolean) => void;
}

const QuickEditMenu = ({ habit, onEditClick, isLocked, setLocked }: Props) => {
    const { deleteHabit } = useContext(HabitContext)!;

    return (
        <HStack>
            <EditIcon className="icon-opacity" onClick={() => onEditClick(habit)} />
            <DeleteIcon className="icon-opacity" onClick={() => deleteHabit(habit, true)} />
            {isLocked ?
                <UnlockIcon className="icon-opacity" onClick={() => setLocked(false)} />
            :
                <LockIcon className= "icon-opacity" onClick={() => setLocked(true)} />
            }
        </HStack>
    )
}

export default QuickEditMenu;