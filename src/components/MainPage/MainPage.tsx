import { Heading, HStack, Box, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { HabitContext } from "../../HabitProvider";
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
    const { loadHabits } = useContext(HabitContext)!;

    const [loadResult, setLoadResult] = useState<LoadResult | null>(null);

    useEffect(() => {
        const load = async () => {
            setLoadResult(await loadHabits());
        }
        load();
    }, [])
    
    

    return (<>
        <TopBar username={user.capitalized} />
        <Heading textAlign="center" fontSize='5xl' marginBottom={5} marginTop={4}>Daily Habits</Heading>
        <HStack mb="2%">
            <Box ml="2%"><HabitList /></Box>
        </HStack>
        {loadResult?.success === false && <Text color="red">{loadResult.message}</Text>}
        <Box width="50%" mb="50px"><Calendar /></Box>
    </>)
}

export default MainPage;
