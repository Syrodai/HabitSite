//import { CSSReset } from '@chakra-ui/react'
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from 'moment';
import {  HabitContext, HabitStatus } from '../HabitProvider';
import { useContext } from 'react';
import { getRelativeDay, toDate } from '../date';

interface Event {
    title: string;
    start: Date;
    end: Date;
}

// needs to be made dark mode compatible
const Calendar = () => {
    const localizer = momentLocalizer(moment);
    const { habits } = useContext(HabitContext)!;

    let eventStartDate = null;
    let habitHistory: Event[] = [];
    for (let i = 0; i < habits.length; i++) {
        const habit = habits[i];
        
        let prev = HabitStatus.PENDING;
        for (let day = 0; day < habit.history.length; day++) {
            // if status is DONE and previous is not DONE, set start date as that day
            // else if previous is DONE set end date to previous day and push
            // set prev to status
            let status = habit.history[day];
            if (status === HabitStatus.DONE && prev !== HabitStatus.DONE) {
                eventStartDate = toDate(getRelativeDay(day, habit.startDate).date);
            } else if (status !== HabitStatus.DONE && prev === HabitStatus.DONE) {
                habitHistory.push({
                    title: habit.description,
                    start: eventStartDate!,
                    end: toDate(getRelativeDay(day-1, habit.startDate).date)
                })
            }
            prev = status;
        }
        // set end date to today and push
        if (prev === HabitStatus.DONE) {
            habitHistory.push({
                title: habit.description,
                start: eventStartDate!,
                end: toDate(getRelativeDay(habit.history.length - 1, habit.startDate).date),
            })
        }
    }

    return (
        <BigCalendar
            localizer={localizer}
            events={habitHistory}
            views={['month']}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, width: 500 }} />
    )
}

export default Calendar;