//import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
//import "react-big-calendar/lib/css/react-big-calendar.css";
//import moment from 'moment';

import {  Habit, HabitContext, HabitStatus } from '../../HabitProvider';
import { useContext, useState } from 'react';
import { HStack } from '@chakra-ui/react';
import { daysSince, getRelativeDay } from '../../date';
import CalendarNavButtons from './CalendarNavButtons';
import "./Calendar.css";
import CalendarLabel from './CalendarLabel';

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
    const { habits } = useContext(HabitContext)!;

    const now = new Date();
    // merged into single useState to prevent double render
    const [displayed, setDisplayed] = useState({
        month: now.getMonth() + 1,
        year: now.getFullYear(),
    });
    const weekStartsOnSunday = true;

    const { startOfCalendarMonth, startDate } = getCalendarInfo(displayed.month, displayed.year, weekStartsOnSunday);
    const daysInMonth1 = new Date(displayed.year, displayed.month + (startDate===1 ? 0 : -1), 0).getDate();
    const daysInMonth2 = new Date(displayed.year, displayed.month + (startDate === 1 ? 1 : 0), 0).getDate();

    // navigation button functions
    const setToCurrent = () => {
        const now = new Date();
        setDisplayed({
            month: now.getMonth() + 1,
            year: now.getFullYear(),
        });
    }
    const setToPrev = () => {
        const prevMonth = new Date(displayed.year, displayed.month-2, 1);
        setDisplayed({
            month: prevMonth.getMonth() + 1,
            year: prevMonth.getFullYear(),
        });
    }
    const setToNext = () => {
        const nextMonth = new Date(displayed.year, displayed.month, 1);
        setDisplayed({
            month: nextMonth.getMonth() + 1,
            year: nextMonth.getFullYear(),
        });
    }

    // generate runs
    const generateCalendarRuns = (calendarStartDate: string, habit: Habit, numWeeks: number) => {
        let runPatterns = [];
        let index = daysSince(habit.startDate, calendarStartDate)
        for (let i = 0; i < numWeeks; i++) {
            let run = 0;
            let runPattern: number[] = [];
            for (let dow = 0; dow < 7; dow++) {
                let isComplete = habit.history[index] === HabitStatus.DONE;
                if (isComplete) {
                    run++;
                } else if (run !== 0) {
                    runPattern.push(run);
                    run = 0;
                    runPattern.push(run);
                } else {
                    runPattern.push(run);
                }
                index++
            }
            if (run !== 0) {
                runPattern.push(run);
            }
            runPatterns.push(runPattern);
        }
        return runPatterns;
    }

    const numWeeks = Math.ceil((startDate === 1 ? daysInMonth1 : daysInMonth1 - startDate + daysInMonth2) / 7);
    const weeks = Array.from({ length: numWeeks }, (_, i) => i + 1);

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
   
    const habitRuns = habits.map((habit) =>
        generateCalendarRuns(startOfCalendarMonth, habit, numWeeks)
    );

    // todo
    // add localised day labels
    // add toggle between sun/mon start of week
    // add toggle to show/hide calendar
    // change background for days out of month
    // change background for current day
    // text truncating
    // need to fix div keys to be unique
    let index = 0; // should change this so that it is a map
    return (<>
        <HStack marginBottom={2} justify="space-between">
            <CalendarNavButtons onClickToday={setToCurrent} onClickBack={setToPrev} onClickNext={setToNext} />
            <CalendarLabel month={displayed.month} year={displayed.year} />
        </HStack>

        <div className="grid-container">
            {days.map((dayLabel, i) => <div key={dayLabel} className="grid-top-label">{days[(i + (weekStartsOnSunday ? 0 : 1)) % 7]}</div>)}
            {weeks.map((_, week) => <>
                {days.map((_, day) => <>
                    <div key={`label-${day}-${week}`} className="grid-item grid-label">{calendarIndexToDate(index++, startDate, daysInMonth1, daysInMonth2)}</div>
                </>)}
                {habitRuns.map((h, i) =>
                    h[week].map((span, j) =>
                        span === 0 ? <div key={`${i}-${j}-${week}`} className="grid-item grid-item-placeholding" /> : <div key={`${i}-${j}-${week}`} className="grid-item grid-run" style={{ gridColumn: `span ${span}` }}>{habits[i].description}</div>
                    )
                )}
            </>)}
            <div key="underline" className="grid-top-border" style={{ gridColumn: "span 7" }} />
        </div>
    </>)
}

export default Calendar;


/*
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
    }*/


/*
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
*/
