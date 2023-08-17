import { HStack, Text, Link } from '@chakra-ui/react';
import { useSignOut } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import ColorModeSwitch from './ColorModeSwitch';

interface Props {
    username: string,
}

// date will be a child component

const TopBar = ({ username }: Props) => {
    const signOut = useSignOut();
    const navigate = useNavigate();

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
            <Text>{date.toLocaleDateString('en-US', dateFormat)}</Text>
            <HStack>
                <Text color="orange">{username}</Text>
                <Link color="blue" onClick={logout}>Sign Out</Link>
                <ColorModeSwitch />
            </HStack>
        </HStack>
    )
}

export default TopBar;