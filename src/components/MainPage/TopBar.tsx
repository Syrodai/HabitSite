import { HStack, Text, Spinner, Menu, Button, MenuButton, MenuItem, MenuList, MenuDivider } from '@chakra-ui/react';
import { useContext } from 'react';
import { useAuthHeader } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import { HabitContext } from '../../HabitProvider';
import { deleteAccount } from "../../services/account";
import ColorModeSwitch from './ColorModeSwitch';

interface Props {
    username: string,
    logOut: () => void;
}

// date will be a child component

const TopBar = ({ username, logOut }: Props) => {
    
    const navigate = useNavigate();
    const { currentlyUpdating } = useContext(HabitContext)!;
    const authHeader = useAuthHeader()();

    const dateFormat: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'America/Los_Angeles'
    }
    const date = new Date();

    const changePassword = () => {
        navigate("/changepassword");
    }

    const closeAccount = async () => {
        const confirmationText = "Are you sure you want to permanently delete your account?";
        if (window.confirm(confirmationText)) {
            const res = await deleteAccount(authHeader);
            if (res.success) logOut();
        }
    }

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
                        <MenuItem color="blue" onClick={logOut}>Sign Out</MenuItem>
                        <MenuItem color="blue" onClick={changePassword}>Change Password</MenuItem>
                        <MenuDivider />
                        <MenuItem color="red" onClick={closeAccount}>Delete Account</MenuItem>
                    </MenuList>
                </Menu>
                <ColorModeSwitch />
            </HStack>
        </HStack>
    )
}

export default TopBar;
