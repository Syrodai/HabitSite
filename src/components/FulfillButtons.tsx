import { useContext } from 'react';
import { Button, Text, HStack } from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Habit, HabitContext, HabitStatus } from "../HabitProvider";
import { daysSince } from '../date';



interface Props {
    bigButton: boolean,
    habit: Habit,
    date: string,
    isLocked: boolean,
}

const FulfillButtons = ({ bigButton, habit, date, isLocked }: Props) => {
    const { fulfillHabit, failHabit, getStatus } = useContext(HabitContext)!;
    if (daysSince(habit.startDate, date) < 0) return null;

    return (
        <HStack spacing={2}>
            <Button colorScheme="red" isDisabled={isLocked} variant={getStatus(habit, date) === HabitStatus.FAILED ? "solid" : "outline"} size='sm' onClick={() => failHabit(habit, date)} >
                {bigButton ? <Text>Missed</Text> : <CloseIcon />}
            </Button>
            <Button colorScheme="green" isDisabled={isLocked} variant={getStatus(habit, date) === HabitStatus.DONE ? "solid" : "outline"} size={bigButton ? 'lg' : 'sm'} onClick={() => fulfillHabit(habit, date)}>
                {bigButton ? <Text>Done!</Text> : <CheckIcon />}
            </Button>
        </HStack>
    )
}

export default FulfillButtons;
