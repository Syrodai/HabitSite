import { Stack, Heading, Center, Box, HStack, Input, Button, Text } from "@chakra-ui/react"
import { z } from 'zod';
import { useNavigate } from "react-router-dom";
import { useForm, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import ColorModeSwitch from "../MainPage/ColorModeSwitch";
import { changePassword } from "../../services/account";
import { useContext, useState } from "react";
import { HabitContext } from "../../HabitProvider";

const schema = z.object({
    oldpassword: z.string(),
    newpassword: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    confirmpassword: z.string()
})
    .refine((data: FormData) => data.confirmpassword === data.newpassword, { //console.log(data.confirmpassword, data.password, data.confirmpassword === data.password) &&
        message: "Confirmation must be identical",
        path: ['confirmpassword'],
    });
type FormData = z.infer<typeof schema>;

const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const { habits } = useContext(HabitContext)!;
    const [changePasswordErrorText, setChangePasswordErrorText] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (data: FieldValues) => {
        const response = await changePassword(data.oldpassword, data.newpassword, habits);
        if (response.success) {
            navigate("/main");
        } else {
            setChangePasswordErrorText(response.message);
        }
        
    }

    return (<>
            <Stack direction="row" justify="flex-end"><ColorModeSwitch /></Stack>
            <Heading textAlign="center" marginBottom={10} marginTop="10%">Change Password</Heading>
            <Center>
                <Box width="25%">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <HStack marginBottom={1}>
                            <Text>Current Password:</Text>
                        <Input type="password" {...register('oldpassword')} autoComplete="off" />
                        </ HStack>
                        {errors.oldpassword && <Text color="red">{errors.oldpassword.message}</Text>}
                        <HStack marginBottom={1}>
                            <Text>New Password:</Text>
                            <Input type="password" {...register('newpassword')} autoComplete="off" />
                        </ HStack>
                        {errors.newpassword && <Text color="red">{errors.newpassword.message}</Text>}
                        <HStack marginBottom={1}>
                            <Text>Confirm Password:</Text>
                            <Input type="password" {...register('confirmpassword')} autoComplete="off" />
                        </ HStack>
                        {errors.confirmpassword && <Text color="red">{errors.confirmpassword.message}</Text>}
                        <Button width="100%" colorScheme="blue" type="submit" >Create</Button>
                    </form>
                {changePasswordErrorText && <Text color="red">{changePasswordErrorText}</Text>}
                </Box>
            </Center>
        </>)
}

export default ChangePasswordPage;
