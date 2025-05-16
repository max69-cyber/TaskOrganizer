import React from 'react';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
    useToast,
    Text
} from '@chakra-ui/react';

const DeleteDialog = ({isOpen, onClose, task, onConfirm, isLoading }) => {
    const cancelRef = React.useRef();
    const toast = useToast();

    const handleConfirm = async () => {
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            toast({
                title: 'Ошибка при удалении',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isCentered
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Удалить задачу
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        {task ? (
                            <>
                                Вы уверены, что хотите удалить задачу "{task.title}"?
                                {task.dueDate && (
                                    <Text fontSize="sm" color="gray.500" mt={2}>
                                        Срок выполнения: {new Date(task.dueDate).toLocaleDateString()}
                                    </Text>
                                )}
                            </>
                        ) : (
                            "Выберите задачу для удаления"
                        )}
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            Отмена
                        </Button>
                        <Button
                            colorScheme='red'
                            onClick={handleConfirm}
                            ml={3}
                            isLoading={isLoading}
                            loadingText="Удаление"
                            isDisabled={!task}
                        >
                            Удалить
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};

export default DeleteDialog;