import { HStack, Switch, useColorMode, Text } from '@chakra-ui/react';
import { MoonIcon } from '@chakra-ui/icons';

const ColorModeSetting = () => {
    const { toggleColorMode, colorMode } = useColorMode();

    return (
        <HStack>
            <Switch colorScheme="blue" isChecked={colorMode === 'dark'} onChange={toggleColorMode} />
            <Text>Dark Mode</Text>
            <MoonIcon />
        </HStack>
    )
}

export default ColorModeSetting;