import { HStack, Button } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

interface Props {
    onClickToday: () => void;
    onClickBack: () => void;
    onClickNext: () => void;
}

const CalendarNavButtons = ({ onClickToday, onClickBack, onClickNext }: Props) => {
    return (
        <HStack>
            <Button onClick={onClickToday} variant="outline">Today</Button>
            <Button onClick={onClickBack} variant="outline"><ChevronLeftIcon /></Button>
            <Button onClick={onClickNext} variant="outline"><ChevronRightIcon /></Button>
        </HStack>
    )
}

export default CalendarNavButtons;