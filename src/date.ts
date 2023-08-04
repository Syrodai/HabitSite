
/*
 * This file provides helper functions relating to date.
 * This should be the only place where Date objects are used directly.
 * Elsewhere, dates are used as strings in yyyy-mm-dd format
 * 
 * All dates should be stored based on to the current clock reading of the user.
 * UTC is not significant for this application.
 * It is more important the date that the user fulfills a habit matches what is on their clock.
 * If they change their local time or use a VPN to cheat their habits, so be it.
*/
//(relativeTo === undefined ? new Date() : new Date(relativeTo))        new Date(new Date().setDate(new Date().getDate() + offset))
// -1 is yesterday, 1 is tomorrow, etc.
export const getDay = (offset: number) => {
    const time = new Date(new Date().setDate(new Date().getDate() + offset))
    const year = time.toLocaleDateString(undefined, { year: 'numeric' });
    const month = time.toLocaleDateString(undefined, { month: '2-digit' });
    const day = time.toLocaleDateString(undefined, { day: '2-digit' });

    const date = year + '-' + month + '-' + day;
    const dayOfWeek = time.toLocaleDateString(undefined, { weekday: 'long' });

    return { date, dayOfWeek };
}

export const getRelativeDay = (offset: number, relativeTo: string) => {
    const relativeDate = toDate(relativeTo);
    const time = new Date(relativeDate.setDate(relativeDate.getDate() + offset));
    const year = time.toLocaleDateString(undefined, { year: 'numeric' });
    const month = time.toLocaleDateString(undefined, { month: '2-digit' });
    const day = time.toLocaleDateString(undefined, { day: '2-digit' });

    const date = year + '-' + month + '-' + day;
    const dayOfWeek = time.toLocaleDateString(undefined, { weekday: 'long' });

    return { date, dayOfWeek };
}

export const toDate = (date: string) => {
    return new Date(Date.parse(date + "T12:00:00"));
}

export const today = () => {
    return getDay(0);
}

export const yesterday = () => {
    return getDay(-1);
}

export const daysSince = (date1: string, date2: string=today().date) => {
    return ((new Date(date2)).getTime() - (new Date(date1)).getTime()) / (86400000)
}