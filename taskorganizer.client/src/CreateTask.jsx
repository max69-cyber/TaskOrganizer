import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Input,
    Text,
    VStack,
    FormControl,
    FormLabel,
    Textarea,
    Checkbox,
    useToast,
    useColorModeValue,
    Select
} from '@chakra-ui/react';
import { createTask } from "@/services/tasksAPI.js";
import { getCategories } from "@/services/categoriesAPI.js";
import ErrorPage from "@/ErrorPage.jsx";
import CustomDateTimePicker from "@/CustomDateTimePicker.jsx";

const CreateTask = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState(null);
    const [priority, setPriority] = useState('Medium');
    const [category, setCategory] = useState('');
    const [condition, setCondition] = useState(false);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);

    const toast = useToast();
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesData = await getCategories();
                setCategories(categoriesData);
                if (categoriesData.length > 0) {
                    setCategory(categoriesData[0].name);
                }
            } catch (e) {
                setError(e.message);
            }
        };
        fetchCategories();
    }, []);

    const priorityOptions = [
        { value: 'High', label: 'Высокий' },
        { value: 'Medium', label: 'Средний' },
        { value: 'Low', label: 'Низкий' }
    ];

    const handleSubmit = async () => {
        try {
            const newTask = {
                title,
                description,
                dueDate: dueDate ? dueDate.toISOString() : null,
                priority,
                category,
                condition
            };

            await createTask(newTask);

            toast({
                title: 'Задача создана!',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
            
            navigate('/tasks');

        } catch (error) {
            toast({
                title: 'Ошибка при создании задачи',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true
            });
        }
    };

    if (error) {
        return <ErrorPage error={error} />;
    }

    return (
        <Box p={8} bg={useColorModeValue('white', 'gray.800')} shadow="md" borderRadius="md">
            <Text fontSize="2xl" mb={4}>Создать новую задачу</Text>
            <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                    <FormLabel>Заголовок</FormLabel>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Введите заголовок"
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Описание</FormLabel>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Введите описание"
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Дата выполнения</FormLabel>
                    <CustomDateTimePicker
                        selected={dueDate}
                        onChange={(date) => setDueDate(date)}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Приоритет</FormLabel>
                    <Select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        {priorityOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Select>
                </FormControl>

                <FormControl>
                    <FormLabel>Категория</FormLabel>
                    <Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </Select>
                </FormControl>

                <FormControl display="flex" alignItems="center">
                    <Checkbox
                        isChecked={condition}
                        onChange={(e) => setCondition(e.target.checked)}
                    >
                        Выполнено
                    </Checkbox>
                </FormControl>

                <Button
                    colorScheme="teal"
                    onClick={handleSubmit}
                    isDisabled={!title} // Кнопка неактивна, пока нет заголовка
                >
                    Создать задачу
                </Button>

                <Button
                    onClick={() => navigate('/tasks')}
                    variant="outline"
                >
                    Отмена
                </Button>
            </VStack>
        </Box>
    );
};

export default CreateTask;