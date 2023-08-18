import { useState } from "react";
import { Input, Text, HStack, Button, Box, Heading, Center, Stack, Link } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useForm, FieldValues } from "react-hook-form";
import { useSignIn } from "react-auth-kit";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import ColorModeSwitch from "../MainPage/ColorModeSwitch";
import { login } from "../../services/account";

const schema = z.object({
    username: z.string().min(2, {message: 'Username is too short'}),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});
type FormData = z.infer<typeof schema>;

interface Props {
    setUser: (user: string) => void;
}

const LoginPage = ({ setUser }: Props) => {
    const navigate = useNavigate();
    const signIn = useSignIn();
    const [loginErrorText, setLoginErrorText] = useState("");

    
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<FormData>({resolver: zodResolver(schema)});

    const onSubmit = async (data: FieldValues) => {
        const result = await login(data.username, data.password, signIn)
        if (result.success) {
            const capitalizedName = data.username.charAt(0).toUpperCase() + data.username.slice(1).toLowerCase();
            setUser({ capitalized: capitalizedName, original: data.username});
            navigate("/main");
        } else {
            setLoginErrorText(result.message);
        }
    }

    return (<>
        <Stack direction="row" justify="flex-end"><ColorModeSwitch /></Stack>
        <Heading textAlign="center" marginBottom={10} marginTop="10%">Login Page</Heading>
        <Center>
            <Box width="25%">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <HStack marginBottom={1}>
                        <Text>Username:</Text>
                        <Input {...register('username')} autoComplete="off" />
                    </ HStack>
                    {errors.username && <Text color="red">{errors.username.message}</Text>}
                    <HStack marginBottom={1}>
                        <Text>Password:</Text>
                        <Input type="password" {...register('password')} autoComplete="off" />
                    </ HStack>
                    {errors.password && <Text color="red">{errors.password.message}</Text>}
                    <Button width="100%" colorScheme="blue" type="submit" isDisabled={!isValid}>Sign In</Button>
                </form>
                {loginErrorText && <Text color="red">{loginErrorText}</Text>}
                <Link color="blue" onClick={() => navigate("/create")}>Create Account</Link>
            </Box>
        </Center>
    </>)
}

export default LoginPage;