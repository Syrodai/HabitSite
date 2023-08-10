import { Badge } from "@chakra-ui/react";
import { daysSince, today } from "../../date";
import { Habit, HabitStatus } from "../../HabitProvider";

interface Props {
    habit: Habit;
}

const Streak = ({ habit }: Props) => {
    const todayIndex = daysSince(habit.startDate, today().date);
    const extendedToday = habit.history[todayIndex] === HabitStatus.DONE;

    let streak = 0;
    let run = 0;

    for (let i = todayIndex; i >= 0; i--) {
        if (habit.history[i] === HabitStatus.DONE) {
            run++;
            if (run > streak) streak = run;
        } else if (habit.history[i] === HabitStatus.PENDING) {
            run = 0;
        } else {
            break;
        }
    }

    return (
        <Badge fontSize='14px' paddingX={2} borderRadius='2px' colorScheme={streak == 0 ? 'gray' : extendedToday ? 'green' : 'yellow' } >{streak}</Badge>
    )
}

export default Streak;