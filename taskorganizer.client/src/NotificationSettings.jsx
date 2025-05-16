import React, { useState, useEffect } from 'react';
import { Box, Button, Select, Text, useToast, VStack, FormControl, FormLabel, useColorModeValue } from '@chakra-ui/react';

const ReminderSettings = () => {
    const [reminder, setReminder] = useState(24);
    const toast = useToast();
    
    useEffect(() => {
        const savedReminder = localStorage.getItem('reminderTime');
        if (savedReminder) {
            setReminder(Number(savedReminder));
        }
    }, []);
    
    const handleSave = () => {
        localStorage.setItem('reminderTime', reminder);
        const message = reminder === 0
            ? 'Уведомления отключены'
            : `Уведомление за ${reminder} часов до задачи`;

        toast({
            title: 'Настройки сохранены',
            description: message,
            status: 'success',
            duration: 3000,
            isClosable: true
        });
    };

    return (
        <Box p={8} bg={useColorModeValue('white', 'gray.800')} shadow="md" borderRadius="md" maxW="400px" mx="auto">
            <Text fontSize="2xl" mb={4}>Настройки напоминаний</Text>
            <VStack spacing={4} align="stretch">
                <FormControl>
                    <FormLabel>Уведомление за</FormLabel>
                    <Select value={reminder} onChange={(e) => setReminder(Number(e.target.value))}>
                        <option value={0}>Выключить</option>
                        <option value={1}>1 час</option>
                        <option value={3}>3 часа</option>
                        <option value={6}>6 часов</option>
                        <option value={12}>12 часов</option>
                        <option value={24}>24 часа</option>
                        <option value={48}>2 дня</option>
                    </Select>
                </FormControl>
                <Button colorScheme="teal" onClick={handleSave} w="full">Сохранить</Button>
            </VStack>
        </Box>
    );
};

export default ReminderSettings;
