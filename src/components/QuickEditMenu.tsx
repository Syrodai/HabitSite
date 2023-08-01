import { HStack } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Habit } from './components/HabitList';
import "../App.css";

interface Props {
    habit: Habit;
    onClickEdit: (habit: Habit) => void;
    onClickDelete: (habit: Habit) => void;
}

const QuickEditMenu = ({ onClickEdit, onClickDelete, habit }: Props) => {
    return (
        <HStack>
            <DeleteIcon className="icon-opacity" onClick={() => onClickDelete(habit)} />
            <EditIcon className="icon-opacity" onClick={onClickEdit} />
        </HStack>
    )
}

export default QuickEditMenu;