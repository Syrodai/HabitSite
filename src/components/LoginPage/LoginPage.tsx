import { Input, Text, HStack, Button, Box, Heading, Center } from "@chakra-ui/react";
import { SyntheticEvent } from "react";

const LoginPage = () => {
    const onSubmit = (event: SyntheticEvent) => {
        event.preventDefault();
        const username = (((event.target as HTMLFormElement)[0]) as HTMLInputElement).value;
        const password = (((event.target as HTMLFormElement)[1]) as HTMLInputElement).value;
        console.log(username, password);

        // check if user exist on server,
        // if yes,
        //       get user's salt from server
        //       salt and hash provided password
        //       send hash to server
        //       if server responds ok,
        //          set user and hash state
        //          route to main page
        //       else
        //          failed login error
        // if no,
        //       user does not exist error
    }

    return (<>
        <Heading textAlign="center" marginBottom={10} marginTop="10%">Login Page</Heading>
        <Center>
            <Box width="25%">
                <form onSubmit={onSubmit}>
                    <HStack marginBottom={1}>
                        <Text>Username:</Text>
                        <Input />
                    </ HStack>
                    <HStack marginBottom={1}>
                        <Text>Password:</Text>
                        <Input type="password" />
                    </ HStack>
                    <Button width="100%" colorScheme="blue" type="submit">Sign In</Button>
                </form>
            </Box>
        </Center>
    </>)
}

export default LoginPage