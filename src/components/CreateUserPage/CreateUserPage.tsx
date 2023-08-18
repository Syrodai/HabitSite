import { useState } from "react";
import { Input, Text, HStack, Button, Box, Heading, Center, Stack, Link } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useForm, FieldValues } from "react-hook-form";
import { useSignIn } from "react-auth-kit";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import ColorModeSwitch from "../MainPage/ColorModeSwitch";
import { createAccount } from "../../services/account";

const schema = z.object({
    username: z.string().min(2, {message: 'Username is too short'}),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    confirmpassword: z.string()
})
    .refine((data: FormData) => data.confirmpassword === data.password, { //console.log(data.confirmpassword, data.password, data.confirmpassword === data.password) &&
    message: "Confirmation must be identical",
    path: ['confirmpassword'],
});
type FormData = z.infer<typeof schema>;

interface Props {
    setUser: (user: string) => void;
}


const CreateUserPage = ({ setUser }: Props) => {
    const navigate = useNavigate();
    const signIn = useSignIn();
    const [createErrorText, setCreateErrorText] = useState("");
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({resolver: zodResolver(schema)});

    const onSubmit = async (data: FieldValues) => {
        const result = await createAccount(data.username, data.password, signIn);
        if (result.success) {
            const capitalizedName = data.username.charAt(0).toUpperCase() + data.username.slice(1).toLowerCase();
            setUser({ capitalized: capitalizedName, original: data.username });
            navigate("/main");
        } else {
            setCreateErrorText(result.message);
        }
    }

    return (<>
        <Stack direction="row" justify="flex-end"><ColorModeSwitch /></Stack>
        <Heading textAlign="center" marginBottom={10} marginTop="10%">Create an Account</Heading>
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
                    <HStack marginBottom={1}>
                        <Text>Confirm Password:</Text>
                        <Input type="password" {...register('confirmpassword')} autoComplete="off" />
                    </ HStack>
                    {errors.confirmpassword && <Text color="red">{errors.confirmpassword.message}</Text>}
                    <Button width="100%" colorScheme="blue" type="submit" >Create</Button>
                </form>
                {createErrorText && <Text color="red">{createErrorText}</Text>}
            </Box>
        </Center>
    </>)
}

export default CreateUserPage;