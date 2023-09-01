import { useContext } from 'react';
import { Button, Text, HStack, Center } from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Habit, HabitContext, HabitStatus } from "../../HabitProvider";
import { daysSince } from '../../date';



interface Props {
    alwaysShowButtons: boolean,
    bigButton: boolean,
    habit: Habit,
    date: string,
    isLocked: boolean,
}

const FulfillButtons = ({ alwaysShowButtons, bigButton, habit, date, isLocked }: Props) => {
    const { fulfillHabit, failHabit, getStatus } = useContext(HabitContext)!;
    if (daysSince(habit.startDate, date) < 0) return null;

    const status = getStatus(habit, date);

    if (alwaysShowButtons || !isLocked) {
        return (
            <Center>
                <HStack spacing={2}>
                    <Button colorScheme="red" isDisabled={isLocked} variant={status === HabitStatus.FAILED ? "solid" : "outline"} size='sm' onClick={() => failHabit(habit, date)} >
                        {bigButton ? <Text>Missed</Text> : <CloseIcon />}
                    </Button>
                    <Button colorScheme="green" isDisabled={isLocked} variant={status === HabitStatus.DONE ? "solid" : "outline"} size={bigButton ? 'lg' : 'sm'} onClick={() => fulfillHabit(habit, date)}>
                        {bigButton ? <Text>Done!</Text> : <CheckIcon />}
                    </Button>
                </HStack>
            </Center>
        )
    }

    if (!alwaysShowButtons) {
        if (status === HabitStatus.PENDING) {
            return (
                <Center>
                    <HStack spacing={2}>
                        <Button colorScheme="red" variant="outline" size='sm' onClick={() => failHabit(habit, date)} >
                            {bigButton ? <Text>Missed</Text> : <CloseIcon />}
                        </Button>
                        <Button colorScheme="green" variant="outline" size={bigButton ? 'lg' : 'sm'} onClick={() => fulfillHabit(habit, date)}>
                            {bigButton ? <Text>Done!</Text> : <CheckIcon />}
                        </Button>
                    </HStack>
                </Center>
            )
        }

        if (status === HabitStatus.FAILED) {
            return (
                <Center><CloseIcon color="red" /></Center>
            )
        }

        if (status === HabitStatus.DONE) {
            return (
                <Center><CheckIcon color="green" /></Center>
            )
        }
    }
}

export default FulfillButtons;
