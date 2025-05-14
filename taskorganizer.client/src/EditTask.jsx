import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Input, Text, VStack, FormControl, FormLabel, Textarea, Checkbox, useToast, useColorModeValue, Select } from '@chakra-ui/react';
import {getTasks, updateTask} from "@/services/tasksAPI.js";
import {getCategories} from "@/services/categoriesAPI.js";
import ErrorPage from "@/ErrorPage.jsx";

const EditTask = ({ task }) => {
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [dueDate, setDueDate] = useState(task?.dueDate || '');
    const [priority, setPriority] = useState(task?.priority || '');
    const [category, setCategory] = useState(task?.category || '');
    const [condition, setCondition] = useState(task?.condition || false);
    const toast = useToast();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const tasksData = await getCategories();
                setCategories(tasksData);
            } catch (e) {
                setError(e.message);
            }
        };
        fetchData();
    }, []);
    
    const priorityOptions = [
        { value: 'High', label: 'Высокий' },
        { value: 'Medium', label: 'Средний' },
        { value: 'Low', label: 'Низкий' }
    ];

    const handleSave = async () => {
        const updatedTask = { ...task, title, description, dueDate, priority, category, condition };
        console.log(updatedTask);
        await updateTask(updatedTask);
        toast({ title: 'Задача обновлена.', status: 'success', duration: 3000, isClosable: true });
        navigate('/tasks');
    };

    if(error !== null) {
        return (
            <ErrorPage
                error={error}
            />
        )
    }

    return (
        <Box p={8} bg={useColorModeValue('white', 'gray.800')} shadow="md" borderRadius="md">
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
                    <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                        {priorityOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <FormLabel>Категория</FormLabel>
                    <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                        {categories.map(option => (
                            <option key={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </Select>
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
