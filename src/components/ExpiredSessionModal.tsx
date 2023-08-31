import { Button, Modal, ModalContent, ModalOverlay, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@chakra-ui/react";

interface Props {
    logOut: () => void;
}

// this modal is triggered via outside components
// therefore it will always render as opened
const ExpiredSessionModal = ({ logOut }: Props) => {
    const { onClose } = useDisclosure()

    const signOut = () => {
        onClose();
        logOut();
    }

    return (
        <Modal closeOnOverlayClick={false} isOpen={true} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Session has expired</ModalHeader>
                <ModalBody>Please sign in again.</ModalBody>
                <ModalFooter>
                    <Button colorScheme='blue' onClick={signOut}>Log Out</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ExpiredSessionModal;