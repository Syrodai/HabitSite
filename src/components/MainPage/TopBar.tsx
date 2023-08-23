import { HStack, Text, Link, Spinner } from '@chakra-ui/react';
import { useContext } from 'react';
import { useSignOut } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import { HabitContext } from '../../HabitProvider';
import ColorModeSwitch from './ColorModeSwitch';

interface Props {
    username: string,
}

// date will be a child component

const TopBar = ({ username }: Props) => {
    const signOut = useSignOut();
    const navigate = useNavigate();
    const { currentlyUpdating } = useContext(HabitContext)!;

    const dateFormat: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'America/Los_Angeles'
    }
    const date = new Date();

    const logout = () => {
        signOut();
        navigate("/");
    }
    

    return (
        <HStack justifyContent='space-between'>
            <HStack>
                <Text>{date.toLocaleDateString('en-US', dateFormat)}</Text>
                { currentlyUpdating && <Spinner size='xs' />}
            </HStack>
            
            <HStack>
                <Text color="orange">{username}</Text>
                <Link color="blue" onClick={logout}>Sign Out</Link>
                <ColorModeSwitch />
            </HStack>
        </HStack>
    )
}

export default TopBar;