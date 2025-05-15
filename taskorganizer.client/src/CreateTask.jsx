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
    Select,
    FormHelperText,
    HStack,
    SimpleGrid
} from '@chakra-ui/react';
import { createTask } from "@/services/tasksAPI.js";
import {createCategory, getCategories} from "@/services/categoriesAPI.js";
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
    const [newCategory, setNewCategory] = useState('');
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

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
            let finalCategory = category;
            
            if (showNewCategoryInput && newCategory.trim()) {
                const createdCategory = await createCategory(newCategory);
                finalCategory = createdCategory.name;
            }
            
            const newTask = {
                title,
                description,
                dueDate: dueDate ? dueDate.toISOString() : null,
                priority,
                category: finalCategory || null,
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
        <Box
            p={8}
            bg={useColorModeValue('white', 'gray.800')}
            shadow="md"
            borderRadius="md"
            maxW="800px"
            mx="auto"
        >
            <Text fontSize="2xl" mb={6} fontWeight="bold">Создать новую задачу</Text>

            <VStack spacing={6} align="stretch">
                <Box>
                    <FormControl isRequired mb={4}>
                        <FormLabel fontWeight="medium">Заголовок</FormLabel>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Краткое название задачи"
                            size="lg"
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel fontWeight="medium">Описание</FormLabel>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Подробное описание задачи"
                            size="lg"
                            minH="120px"
                        />
                    </FormControl>
                </Box>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FormControl isRequired>
                        <FormLabel fontWeight="medium">Дата выполнения</FormLabel>
                        <CustomDateTimePicker
                            selected={dueDate}
                            onChange={(date) => setDueDate(date)}
                        />
                    </FormControl>
                    
                    <FormControl>
                        <FormLabel fontWeight="medium">Приоритет</FormLabel>
                        <Select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            size="lg"
                        >
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
                    
                    <FormControl display="flex" alignItems="flex-end">
                        <Checkbox
                            isChecked={condition}
                            onChange={(e) => setCondition(e.target.checked)}
                            size="lg"
                            colorScheme="teal"
                        >
                            <Text fontWeight="medium">Задача выполнена</Text>
                        </Checkbox>
                    </FormControl>
                </SimpleGrid>
                
                <HStack spacing={4} mt={8} justify="flex-end">
                    <Button
                        onClick={() => navigate('/tasks')}
                        variant="outline"
                        size="lg"
                        width={{ base: '100%', md: 'auto' }}
                    >
                        Отмена
                    </Button>
                    <Button
                        colorScheme="teal"
                        onClick={handleSubmit}
                        isDisabled={!title}
                        size="lg"
                        width={{ base: '100%', md: 'auto' }}
                    >
                        Создать задачу
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
};

export default CreateTask;