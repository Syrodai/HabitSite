import { Heading, HStack, Box, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { HabitContext } from "../../HabitProvider";
import { SettingsContext } from "../../SettingsProvider";
import ExpiredSessionModal from "../ExpiredSessionModal";
import Calendar from "./Calendar/Calendar";
import HabitList from "./HabitList";
import TopBar from "./TopBar";

interface Props {
    user: { capitalized: string, lower: string };
    logOut: () => void;
}

interface LoadResult {
    success: boolean;
    message: string;
}

const MainPage = ({ user, logOut }: Props) => {
    const { loadHabits, clearHabits, sessionExpired } = useContext(HabitContext)!;
    const { settings } = useContext(SettingsContext)!;

    const [loadResult, setLoadResult] = useState<LoadResult | null>(null);
    
    
    useEffect(() => {
        clearHabits();
        const load = async () => {
            setLoadResult(await loadHabits());
        }
        load();
    }, [])

    return (<>
        <TopBar username={user.capitalized} logOut={logOut} />
        <Heading textAlign="center" fontSize='5xl' marginBottom={5} marginTop={4}>Daily Habits</Heading>
        <HStack mb="2%">
            <Box ml="2%"><HabitList /></Box>
        </HStack>
        {loadResult?.success === false && <Text color="red">{loadResult.message}</Text>}
        <Box width="50%" mb="50px"><Calendar weekStartOnSunday={!settings.mondayStart} /></Box>
        {sessionExpired && <ExpiredSessionModal logOut={logOut} />}
    </>)
}

export default MainPage;
