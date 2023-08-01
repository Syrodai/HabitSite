import { Button, HStack, Input } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useEffect, useRef, useState, useContext } from 'react';
import '../App.css';
import { HabitContext } from '../HabitProvider';


const HabitCreator = () => {
    const [creatingHabit, setCreatingHabit] = useState(false);
    const [habitDescription, setHabitDescription] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const { createHabit } = useContext(HabitContext)!;

    // auto focus input
    useEffect(() => inputRef?.current?.focus(), [creatingHabit]);

    const placeholder = "I want to...";

    return (<>{
        !creatingHabit ?
            <Button colorScheme="blue" variant="solid" size='sm' marginLeft={10} onClick={() => { setCreatingHabit(true); setHabitDescription("")}}>Create Habit</Button>
            :
            <form onSubmit={(event) => { event.preventDefault(); setCreatingHabit(false); createHabit(habitDescription) }}>
                <HStack marginLeft={10} marginBottom={2}>
                    <Input ref={inputRef} width="50%" placeholder={placeholder} onChange={(event) => setHabitDescription(event.target.value)} />
                    <CloseIcon className="icon-opacity" onClick={() => setCreatingHabit(false)} />
                </HStack>
                <Button isDisabled={habitDescription === ""} colorScheme="blue" variant="solid" size='sm' marginLeft={10} type="submit">Submit</Button>
            </form>
    }</>)
}

//
export default HabitCreator;