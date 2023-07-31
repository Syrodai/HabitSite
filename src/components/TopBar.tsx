import { HStack, Text } from '@chakra-ui/react';

interface Props {
    username: string,
}

const TopBar = ({ username }: Props) => {
    return (
        <HStack>
            <Text color="orange">{username}</Text>
        </HStack>
    )
}

export default TopBar;