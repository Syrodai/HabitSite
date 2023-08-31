import { Heading, HStack, Box, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useSignOut } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import { HabitContext } from "../../HabitProvider";
import ExpiredSessionModal from "../ExpiredSessionModal";
import Calendar from "./Calendar/Calendar";
import HabitList from "./HabitList";
import TopBar from "./TopBar";

interface Props {
    user: {capitalized: string, lower: string};
}

interface LoadResult {
    success: boolean;
    message: string;
}

const MainPage = ({ user }: Props) => {
    const signOut = useSignOut();
    const navigate = useNavigate();
    const { loadHabits, clearHabits, sessionExpired, setSessionExpired } = useContext(HabitContext)!;

    const [loadResult, setLoadResult] = useState<LoadResult | null>(null);

    const [weekStartOnSunday, setWeekStartOnSunday] = useState(true);

    const logOut = () => {
        signOut();
        localStorage.removeItem('dataKey');
        clearHabits();
        setSessionExpired(false);
        navigate("/");
    }
    
    useEffect(() => {
        clearHabits();
        const load = async () => {
            setLoadResult(await loadHabits());
        }
        load();
    }, [])

    return (<>
        <TopBar username={user.capitalized} logOut={logOut} toggleStartOfWeek={() => setWeekStartOnSunday(!weekStartOnSunday)} />
        <Heading textAlign="center" fontSize='5xl' marginBottom={5} marginTop={4}>Daily Habits</Heading>
        <HStack mb="2%">
            <Box ml="2%"><HabitList /></Box>
        </HStack>
        {loadResult?.success === false && <Text color="red">{loadResult.message}</Text>}
        <Box width="50%" mb="50px"><Calendar weekStartOnSunday={weekStartOnSunday} /></Box>
        {sessionExpired && <ExpiredSessionModal logOut={logOut} />}
    </>)
}

export default MainPage;
