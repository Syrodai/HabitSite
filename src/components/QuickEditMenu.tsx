import { HStack } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useContext } from 'react';
import { HabitContext, Habit } from "../HabitProvider";
import "../App.css";

interface Props {
    habit: Habit;
}

const QuickEditMenu = ({ habit }: Props) => {
    const { deleteHabit } = useContext(HabitContext)!;

    return (
        <HStack>
            <DeleteIcon className="icon-opacity" onClick={() => deleteHabit(habit)} />
            <EditIcon className="icon-opacity" onClick={() => deleteHabit(habit)} />
        </HStack>
    )
}

export default QuickEditMenu;