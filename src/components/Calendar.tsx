//import { CSSReset } from '@chakra-ui/react'
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";

import moment from 'moment';
import {  Habit, HabitContext, HabitStatus } from '../HabitProvider';
import { useContext } from 'react';
import { getRelativeDay, toDate } from '../date';
import { Table, Tr, Td, Thead , Tbody } from '@chakra-ui/react';
import "./Calendar.css";

interface Event {
    title: string;
    start: Date;
    end: Date;
}

// needs to be made dark mode compatible
const Calendar = () => {
    const localizer = momentLocalizer(moment);
    const { habits, getStatus } = useContext(HabitContext)!;

    // generate runs
    const generateCalendarRuns = (calendarStartDate: string, habit: Habit, numWeeks: number = 5) => {
        let runPatterns = [];

        for (let i = 0; i < numWeeks; i++) {
            let run = 0;
            let runPattern: number[] = [];
            for (let dow = 0; dow < 7; dow++) {
                let date = getRelativeDay((i * 7 + dow), calendarStartDate).date;
                let isComplete = getStatus(habit, date) === HabitStatus.DONE;
                if (isComplete) {
                    run++;
                } else if (run !== 0) {
                    runPattern.push(run);
                    run = 0;
                    runPattern.push(run);
                } else {
                    runPattern.push(run);
                }
            }
            if (run !== 0) {
                runPattern.push(run);
            }
            runPatterns.push(runPattern);
        }
        return runPatterns;
    }






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
                    end: toDate(getRelativeDay(day - 1, habit.startDate).date)
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

    const weeks = [1, 2, 3, 4, 5];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const habitRuns = habits.map((habit) =>
        generateCalendarRuns("2023-07-30", habit, 5)
    );
    
    return (<>
        <BigCalendar
            localizer={localizer}
            events={habitHistory}
            views={['month']}
            startAccessor="start"
            endAccessor="end"
            maxRows={habits.length}
            style={{ height: 300, width: 500 }}
            doShowMoreDrillDown={false}
            selected={null}
            onSelectEvent={() => null}
            popup={false}
        />

        <div className="grid-container">
        {weeks.map((_, week) => <>
            <div className="grid-item" align="right">12</div>
            <div className="grid-item" align="right">12</div>
            <div className="grid-item" align="right">12</div>
            <div className="grid-item" align="right">12</div>
            <div className="grid-item" align="right">12</div>
            <div className="grid-item" align="right">12</div>
            <div className="grid-item" align="right">12</div>
            {habitRuns.map((h) =>
                h[week].map((span) =>
                    span === 0 ? <div className="grid-item" /> : <div className="grid-item grid-run" style={{ gridColumn: `span ${span}` }}>desc</div>
                )
            )}
            
        </>)}
        </div>
    </>)
}

export default Calendar;

function getStatus(habit: Habit, date: { date: string; dayOfWeek: string; }) {
    throw new Error('Function not implemented.');
}
