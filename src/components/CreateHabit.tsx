import { Button, HStack, Input } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import '../App.css';

const CreateHabit = () => {
    const [creatingHabit, setCreatingHabit] = useState(false);

    return (<>{
        !creatingHabit ?
            <Button colorScheme="blue" variant="solid" size='sm' marginLeft={10} onClick={() => setCreatingHabit(true)}>Create Habit</Button>
        :<>
            <HStack marginLeft={10}>
                <Input width="50%" />
                    <CloseIcon colorScheme="red" className="icon-opacity" onClick={() => setCreatingHabit(false)}/>
            </HStack>
            <Button colorScheme="blue" variant="solid" size='sm' marginLeft={10} onClick={() => setCreatingHabit(false)}>Submit</Button>
        </>
    }</>)
}


export default CreateHabit;