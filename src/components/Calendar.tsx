//import { CSSReset } from '@chakra-ui/react'
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";

import moment from 'moment';
import {  Habit, HabitContext, HabitStatus } from '../HabitProvider';
import { useContext } from 'react';
import { getRelativeDay, toDate } from '../date';
import "./Calendar.css";

interface Event {
    title: string;
    start: Date;
    end: Date;
}

// helper function that turns an index of a calendar month into the correct day of month
const calendarIndexToDate = (index: number, startDate: number, daysInMonth1: number, daysInMonth2: number) => {
    index = index + startDate;
    index = index - daysInMonth2 * Math.floor(index / (daysInMonth2 + daysInMonth1 + 1));
    index = index - daysInMonth1 * Math.floor(index / (daysInMonth1 + 1));
    return index;
}

const getCalendarInfo = (month: number, year: number, startOnSunday: boolean) => {
    const dowIndex = (new Date(year, month - 1, 1).getDay() - (startOnSunday ? 0 : 1)) % 7;
    const start = getRelativeDay(-dowIndex, year.toString() + "-" + month.toString().padStart(2, '0') + "-" + "01");
    const startOfCalendarMonth = start.date;
    const startDate = parseInt(start.dayOfMonth)
    return { startOfCalendarMonth, startDate };
}

// needs to be made dark mode compatible
const Calendar = () => {
    const localizer = momentLocalizer(moment);
    const { habits, getStatus } = useContext(HabitContext)!;

    // probably should become useState
    const displayedMonth = new Date().getMonth()+1;
    const displayedYear = new Date().getFullYear();
    const weekStartsOnSunday = true;

    const { startOfCalendarMonth, startDate } = getCalendarInfo(displayedMonth, displayedYear, weekStartsOnSunday);
    const daysInMonth1 = new Date(displayedYear, displayedMonth + (startDate===1 ? 0 : -1), 0).getDate();
    const daysInMonth2 = new Date(displayedYear, displayedMonth + (startDate===1 ? 1 : 0), 0).getDate();

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

    //const startOfCalendarMonth = "2023-07-30";

    const habitRuns = habits.map((habit) =>
        generateCalendarRuns(startOfCalendarMonth, habit, 5)
    );

    // todo
    // add day labels
    // add month and year label
    // add toggle between sun/mon start of week
    // browse between months, storing the day that is the calendar start and the number of calendar weeks
    // add toggle to show/hide calendar
    // change background for days out of month
    // change background for current day
    // text truncating
    // improve performance
    // need to fix div keys to be unique

    let index = 0; // should change this so that it is a map
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
            {days.map((_, day) => <>
                <div key={`label${index}`} className="grid-item grid-label">{calendarIndexToDate(index++, startDate, daysInMonth1, daysInMonth2)/*getRelativeDay(week * 7 + day, startOfCalendarMonth).dayOfMonth*/}</div>
            </>)}
            {habitRuns.map((h, i) =>
                h[week].map((span) =>
                    span === 0 ? <div key={`${habits[i].id}-${index}`} className="grid-item" /> : <div key={`${habits[i].id}-${index}`} className="grid-item grid-run" style={{ gridColumn: `span ${span}` }}>{habits[i].description}</div>
                )
            )}
            
        </>)}
        </div>
    </>)
}

export default Calendar;
