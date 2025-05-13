import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Input, Text, VStack, FormControl, FormLabel, Textarea, Checkbox, useToast } from '@chakra-ui/react';
import {updateTask} from "@/services/tasksAPI.js";

const EditTask = ({ task }) => {
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [dueDate, setDueDate] = useState(task?.dueDate || '');
    const [priority, setPriority] = useState(task?.priority || '');
    const [category, setCategory] = useState(task?.category || '');
    const [condition, setCondition] = useState(task?.condition || false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleSave = async () => {
        const updatedTask = { ...task, title, description, dueDate, priority, category, condition };
        console.log(updatedTask);
        await updateTask(updatedTask);
        toast({ title: 'Задача обновлена.', status: 'success', duration: 3000, isClosable: true });
        navigate('/tasks');
    };

    return (
        <Box p={8} bg="white" shadow="md" borderRadius="md">
            <Text fontSize="2xl" mb={4}>Редактировать задачу</Text>
            <VStack spacing={4} align="stretch">
                <FormControl>
                    <FormLabel>Заголовок</FormLabel>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Введите заголовок" />
                </FormControl>
                <FormControl>
                    <FormLabel>Описание</FormLabel>
                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Введите описание" />
                </FormControl>
                <FormControl>
                    <FormLabel>Дата выполнения</FormLabel>
                    <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </FormControl>
                <FormControl>
                    <FormLabel>Приоритет</FormLabel>
                    <Textarea value={priority} onChange={(e) => setPriority(e.target.value)} placeholder="Введите описание" />
                </FormControl>
                <FormControl>
                    <FormLabel>Категория</FormLabel>
                    <Textarea value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Введите описание" />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                    <Checkbox isChecked={condition} onChange={(e) => setCondition(e.target.checked)}>Выполнено</Checkbox>
                </FormControl>
                <Button colorScheme="teal" onClick={handleSave} w="full">Сохранить</Button>
                <Button onClick={() => navigate('/tasks')} w="full" variant="outline">Отмена</Button>
            </VStack>
        </Box>
    );
};

export default EditTask;
