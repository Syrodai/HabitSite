import { Heading } from "@chakra-ui/react";

interface Props {
    month: number; // starts at 0=January
    year: number;
}

const CalendarLabel = ({ month, year }: Props) => {
    const label = new Date(0, month-1).toLocaleString('default', { month: 'long' }) + " " + year.toString();

    return (
        <Heading as='h1' size='lg'>{label}</Heading>
    )
}

export default CalendarLabel;