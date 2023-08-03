import { Badge } from "@chakra-ui/react";
import { daysSince, today } from "../date";
import { Habit, HabitStatus } from "../HabitProvider";

interface Props {
    habit: Habit;
}

const Streak = ({ habit }: Props) => {
    let streak = 0;

    for (let i = daysSince(habit.startDate, today().date); i >= 0; i--) {
        if (habit.history[i] !== HabitStatus.DONE)
            break;
        streak++;
    }

    return (
        <Badge fontSize='14px' paddingX={2} borderRadius='2px' colorScheme={streak>0 ? 'yellow' : 'gray'} >{streak}</Badge>
    )
}

export default Streak;