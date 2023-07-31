import { HStack, Box } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useState } from "react";

interface Props {
    onClickEdit: () => void;
    onClickDelete: () => void;
}

const QuickEditMenu = ({ onClickEdit, onClickDelete }: Props) => {
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
            <DeleteIcon alt="Delete Habit" onClick={onClickDelete} {...MouseOverOpacity('del')}  />
            <EditIcon alt="Edit Habit" onClick={onClickEdit} {...MouseOverOpacity('edit')} />
        </HStack>
    )
}

export default QuickEditMenu;