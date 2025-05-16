import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Input, Text, VStack, FormControl, FormLabel, Textarea, Checkbox, useToast, useColorModeValue, Select, HStack } from '@chakra-ui/react';
import {getTasks, updateTask} from "@/services/tasksAPI.js";
import {createCategory, getCategories} from "@/services/categoriesAPI.js";
import ErrorPage from "@/ErrorPage.jsx";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CustomDateTimePicker from "@/CustomDateTimePicker.jsx";

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
    const [newCategory, setNewCategory] = useState('');
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    
    
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

    const parseDateFromString = (dateString) => {
        if (!dateString) return null;

        try {
            const cleanedDate = dateString.split('.')[0].replace(' +00:00', '');
            const date = new Date(cleanedDate);
            return isNaN(date.getTime()) ? null : date;
        } catch (e) {
            console.error('Ошибка парсинга даты:', e);
            return null;
        }
    };

    useEffect(() => {
        if (task?.dueDate) {
            setDueDate(parseDateFromString(task.dueDate));
        }
    }, [task]);
    
    const priorityOptions = [
        { value: 'High', label: 'Высокий' },
        { value: 'Medium', label: 'Средний' },
        { value: 'Low', label: 'Низкий' }
    ];

    const handleSave = async () => {
        try {
            let finalCategory = category;
    
            if (showNewCategoryInput && newCategory.trim()) {
                const createdCategory = await createCategory(newCategory);
                finalCategory = createdCategory.name;
            }
            
            const updatedTask = { 
                ...task,
                title,
                description,
                dueDate:dueDate.toISOString(),
                priority,
                category: finalCategory || null,
                condition 
            };
            
            await updateTask(updatedTask);
            
            toast({ title: 'Задача обновлена.', status: 'success', duration: 3000, isClosable: true });
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
                        <CustomDateTimePicker
                            selected={dueDate}
                            onChange={(date) => setDueDate(date)}
                        />
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
                    <FormLabel fontWeight="medium">Категория</FormLabel>
                    <HStack>
                        <Select
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                if (e.target.value === 'new') {
                                    setShowNewCategoryInput(true);
                                    setCategory('');
                                } else {
                                    setShowNewCategoryInput(false);
                                }
                            }}
                            size="lg"
                            flex="1"
                        >
                            <option value="">Без категории</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                            <option value="new">+ Новая категория</option>
                        </Select>

                        {showNewCategoryInput && (
                            <Input
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="Введите название"
                                size="lg"
                            />
                        )}
                    </HStack>
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
