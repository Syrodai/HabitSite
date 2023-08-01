import { Button, HStack, Input } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import '../App.css';

interface Props {
    onCreateHabit: (description: string) => void;
}

const CreateHabit = ({ onCreateHabit}: Props) => {
    const [creatingHabit, setCreatingHabit] = useState(false);
    const [habitDescription, setHabitDescription] = useState("");

    const placeholder = "I want to...";

    return (<>{
        !creatingHabit ?
            <Button colorScheme="blue" variant="solid" size='sm' marginLeft={10} onClick={() => { setCreatingHabit(true); setHabitDescription("") }}>Create Habit</Button>
            :
            <form>
                <HStack marginLeft={10} marginBottom={2}>
                <Input width="50%" placeholder={placeholder} onChange={(event) => setHabitDescription(event.target.value)}/>
                <CloseIcon className="icon-opacity" onClick={() => setCreatingHabit(false)} />
            </HStack>
            <Button isDisabled={habitDescription === ""} colorScheme="blue" variant="solid" size='sm' marginLeft={10} onClick={() => { setCreatingHabit(false); onCreateHabit(habitDescription) }} type="submit">Submit</Button>
            </form>
    }</>)
}

//
export default CreateHabit;