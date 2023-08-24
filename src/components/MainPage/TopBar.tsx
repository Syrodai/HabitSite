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
    const { currentlyUpdating, clearHabits } = useContext(HabitContext)!;

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
        clearHabits();
        navigate("/");
    }

    const deleteAccount = () => {
        const confirmationText = "Are you sure you want to permanently delete your account?";
        if (window.confirm(confirmationText)) 
            console.log('deleted')
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
                <Link color="red" onClick={deleteAccount}>Delete Account</Link>
                <ColorModeSwitch />
            </HStack>
        </HStack>
    )
}

export default TopBar;