import { useAuthUser } from 'react-auth-kit';
import { Heading, HStack, Box } from "@chakra-ui/react";
import Calendar from "./Calendar/Calendar";
import HabitList from "./HabitList";
import TopBar from "./TopBar";

interface Props {
    user: {capitalized: string, original: string};
}

const MainPage = ({ user }: Props) => {
    return (<>
        <TopBar username={user.capitalized} />
        <Heading textAlign="center" fontSize='5xl' marginBottom={5} marginTop={4}>Daily Habits</Heading>
        <HStack mb="2%">
            <Box ml="2%"><HabitList /></Box>
        </HStack>
        <Box width="50%" mb="50px"><Calendar /></Box>
    </>)
}

export default MainPage;

