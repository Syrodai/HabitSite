import { HStack, Text } from '@chakra-ui/react';
import ColorModeSwitch from './ColorModeSwitch';

interface Props {
    username: string,
}

// date will be a child component

const TopBar = ({ username }: Props) => {

    const dateFormat: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'America/Los_Angeles'
    }

    const date = new Date();
    //console.log(date.getTimezoneOffset());

    return (
        <HStack justifyContent='space-between'>
            <Text>{date.toLocaleDateString('en-US', dateFormat)}</Text>
            <HStack>
                <Text color="orange">{username}</Text>
                <ColorModeSwitch />
            </HStack>
        </HStack>
    )
}

export default TopBar;