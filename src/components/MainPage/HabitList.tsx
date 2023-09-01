import { List, HStack, Text, Box, VStack, Skeleton } from "@chakra-ui/react";
import { useContext } from "react";
import HabitCreator from "./HabitCreator";
import { Habit, HabitContext } from "../../HabitProvider";
import { getDay, today, yesterday } from "../../date";
import HabitListItem from "./HabitListItem";

const HabitList = () => {
    const { habits, loadingHabits } = useContext(HabitContext)!;

    const alwaysShowButtons = false;
    const descriptionWidth = "200px"
    const columnWidth = "120px";
    const rowHeight = "35px";
    const labelFontSize = "20px";
    const smallLabelFontSize = "18px";

    return (
        <div>
            <HStack>
                <HStack>
                    <Text as='b' width={columnWidth} fontSize={smallLabelFontSize}>{getDay(-2).dayOfWeek}</Text>
                    <VStack spacing={0} width={columnWidth}>
                        <Text fontSize={labelFontSize} as='b'>Yesterday</Text>
                        <Text>({yesterday().dayOfWeek})</Text>
                    </VStack>
                    <VStack spacing={0} width={columnWidth}>
                        <Text fontSize={labelFontSize} as='b'>Today</Text>
                        <Text>({today().dayOfWeek})</Text>
                    </VStack>
                </HStack>
                <Text fontSize={labelFontSize} as='b' width={descriptionWidth}>Habit</Text>
            </HStack>
            

            {loadingHabits && <>
                <Skeleton marginBottom={1} height='30px' />
                <Skeleton marginBottom={1} height='30px' />
                <Skeleton marginBottom={1} height='30px' />
            </>}

            {!loadingHabits && <>
                <List>
                    {habits.map((habit: Habit) =>
                        <HabitListItem habit={habit} key={habit.id} alwaysShowButtons={alwaysShowButtons} descriptionWidth={descriptionWidth} columnWidth={columnWidth} rowHeight={rowHeight} />
                    )}
                </List>

                <Box width={625} ml={385}><HabitCreator /></Box>
            </>}
        </div>
    )
}

export default HabitList;
