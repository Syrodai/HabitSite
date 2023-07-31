import { HStack } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Habit } from './components/HabitList';
import { useState } from "react";

interface Props {
    habit: Habit;
    onClickEdit: () => void;
    onClickDelete: (habit: Habit) => void;
}

const QuickEditMenu = ({ onClickEdit, onClickDelete, habit }: Props) => {
    const [hovered, setHovered] = useState<string>("");
    
    const MouseOverOpacity = (key: string) => {
        return {
            onMouseOver: () => { setHovered(key) },
            onMouseOut: () => { if (hovered === key) setHovered("") },
            opacity: hovered===key ? 0.75 : 0.5
        }
    }

    return (
        <HStack>
            <DeleteIcon alt="Delete Habit" onClick={() => onClickDelete(habit)} {...MouseOverOpacity('del')}  />
            <EditIcon alt="Edit Habit" onClick={onClickEdit} {...MouseOverOpacity('edit')} />
        </HStack>
    )
}

export default QuickEditMenu;