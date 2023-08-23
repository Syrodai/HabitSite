import { List, HStack, Text, Box, VStack, Skeleton } from "@chakra-ui/react";
import { useContext } from "react";
import HabitCreator from "./HabitCreator";
import { Habit, HabitContext } from "../../HabitProvider";
import { getDay, today, yesterday } from "../../date";
import HabitListItem from "./HabitListItem";

const HabitList = () => {
    const { habits, loadingHabits } = useContext(HabitContext)!;

    return (
        <div>
            
            <HStack>
                <Text as='b' width={100}>{getDay(-2).dayOfWeek}</Text>
                <VStack spacing={0} width={100}>
                    <Text fontSize='20px' as='b'>Yesterday</Text>
                    <Text>({yesterday().dayOfWeek})</Text>
                </VStack>
                <VStack spacing={0} width={180}>
                    <Text fontSize='20px' as='b'>Today</Text>
                    <Text>({today().dayOfWeek})</Text>
                </VStack>
                <Text fontSize='20px' as='b' width={300}>Habit</Text>
            </HStack>

            {loadingHabits && <>
                <Skeleton marginBottom={1} height='30px' />
                <Skeleton marginBottom={1} height='30px' />
                <Skeleton marginBottom={1} height='30px' />
            </>}

            {!loadingHabits && <>
                <List>
                    {habits.map((habit: Habit) =>
                        <HabitListItem habit={habit} key={habit.id} />
                    )}
                </List>

                <Box width={625} ml={400}><HabitCreator /></Box>
            </>}

            

        </div>
    )
}

export default HabitList;
