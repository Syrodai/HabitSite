import { HStack, Text, Spinner, Menu, Button, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { HabitContext } from '../../HabitProvider';
import ColorModeSwitch from './ColorModeSwitch';

interface Props {
    username: string,
    logOut: () => void;
}

// date will be a child component

const TopBar = ({ username, logOut }: Props) => {
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

    return (
        <HStack justifyContent='space-between'>
            <HStack>
                <Text>{date.toLocaleDateString('en-US', dateFormat)}</Text>
                {currentlyUpdating && <Spinner size='xs' />}
            </HStack>

            <HStack>
                <Menu>
                    <MenuButton color="orange" as={Button}>{username}</MenuButton>
                    <MenuList>
                        <MenuItem color="blue" onClick={() => navigate("/settings")}>Settings</MenuItem>
                        <MenuItem color="blue" onClick={logOut}>Sign Out</MenuItem>
                    </MenuList>
                </Menu>
                <ColorModeSwitch />
            </HStack>
        </HStack>
    )
}

export default TopBar;
