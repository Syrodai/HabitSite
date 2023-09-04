import { Button, VStack } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useAuthHeader } from 'react-auth-kit';
import { useNavigate } from "react-router-dom";
import ColorModeSetting from "./ColorModeSetting";
import { deleteAccount } from "../../services/account";
import StartOfWeekSetting from "./StartOfWeekSetting";

interface Props {
    logOut: () => void;
}

const SettingsPage = ({ logOut }: Props) => {
    const authHeader = useAuthHeader()();
    const navigate = useNavigate();

    const closeAccount = async () => {
        const confirmationText = "Are you sure you want to permanently delete your account?";
        if (window.confirm(confirmationText)) {
            const res = await deleteAccount(authHeader);
            if (res.success) logOut();
        }
    }

    return (
        <div>
            <Button onClick={() => navigate("/main")}><ArrowBackIcon />Habits</Button>
            <VStack marginTop="100px" marginBottom="100px" align="left" marginLeft="10%" spacing="10px">
                <ColorModeSetting />
                <StartOfWeekSetting />
            </VStack>
            <VStack width="200px" align="left" marginLeft="10%">
                <Button colorScheme="blue" onClick={() => navigate("/changepassword")}>Change Password</Button>
                <Button colorScheme="blue" onClick={logOut}>Sign Out</Button>
                <Button colorScheme="red" onClick={closeAccount}>Delete Account</Button>
            </VStack>
        </div>
    )
}

export default SettingsPage;