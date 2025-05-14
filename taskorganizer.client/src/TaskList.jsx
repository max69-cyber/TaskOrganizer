import React from 'react';
import {
    Box,
    Text,
    VStack,
    HStack,
    Checkbox,
    Button,
    IconButton,
    Badge,
    useColorModeValue
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { DeleteIcon, EditIcon, TimeIcon } from '@chakra-ui/icons';
import { getTasks } from './services/tasksAPI.js';
import ErrorPage from './ErrorPage.jsx';

const PriorityBadge = ({ priority }) => {
    const colorScheme = {
        High: 'red',
        Medium: 'orange',
        Low: 'green'
    }[priority];

    const text = {
        High: 'Высокий',
        Medium: 'Средний',
        Low: 'Низкий'
    }[priority];

    return <Badge colorScheme={colorScheme}>{text}</Badge>;
};

const TaskList = ({selectedTask, onSelect}) => {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const tasksData = await getTasks();
                setTasks(tasksData);
            } catch (e) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);
    
    const bgColor = useColorModeValue('white', 'gray.700');
    const completedColor = useColorModeValue('gray.200', 'gray.600');

    // Функция для форматирования даты
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    if(error !== null) {
        return (
            <ErrorPage
                error={error}
            />
        )
    }
    
    return (
        <Box className="p-4" 
             maxW="800px" 
             mx="auto"
        >
            
            <Text fontSize="2xl" mb={6} fontWeight="bold">Список задач</Text>
            <Box maxH="calc(100vh - 200px)"
                 overflowY="auto"
                 pr={1.5}>
                <VStack spacing={4} align="stretch">
                    {tasks.map((task) => (
                        <Box
                            key={task.id}
                            p={4}
                            shadow="md"
                            bg={task.condition ? completedColor : bgColor}
                            borderRadius="md"
                            borderLeftWidth="4px"
                            borderLeftColor={
                                task.condition ? 'gray.400' :
                                    task.priority === 'High' ? 'red.500' :
                                        task.priority === 'Medium' ? 'orange.500' : 'green.500'
                            }
                            opacity={task.condition ? 0.8 : 1}
                            onClick={() => onSelect(task)}
                            borderRightWidth={selectedTask?.id === task.id ? '4px' : '1px'}
                            borderRightColor={selectedTask?.id === task.id ? 'teal.500' : 'gray.200'}
                            borderBottomWidth={selectedTask?.id === task.id ? '4px' : '1px'}
                            borderBottomColor={selectedTask?.id === task.id ? 'teal.500' : 'gray.200'}
                            cursor="pointer"
                            position="relative"
                            _hover={{
                                transform: 'scale(0.97)',
                            }}
                        >
                            <HStack justify="space-between" align="center">
                                <HStack align="flex-start" spacing={4}>

                                    <Box>
                                        <Text
                                            fontSize="lg"
                                            fontWeight="bold"
                                            textDecoration={task.condition ? 'line-through' : 'none'}
                                        >
                                            {task.title}
                                        </Text>
                                        <Text fontSize="md" color="gray.500" mb={2}>
                                            {task.description}
                                        </Text>
                                        <HStack spacing={4} mt={2}>
                                            <HStack>
                                                <TimeIcon color="gray.500" />
                                                <Text fontSize="sm" color="gray.500">
                                                    {formatDate(task.dueDate)}
                                                </Text>
                                            </HStack>
                                            <PriorityBadge priority={task.priority} />
                                        </HStack>
                                    </Box>
                                </HStack>

                                <Checkbox
                                    isChecked={task.condition}
                                    colorScheme="teal"
                                    size="lg"
                                    m={2}
                                    onChange={(e) => {}}
                                />
                            </HStack>

                            <Button
                                position="absolute"
                                top={0}
                                left={0}
                                w="100%"
                                h="100%"
                                p={0}
                                bg="transparent"
                                _hover={{
                                    bg: 'transparent',
                                    transform: 'none',
                                    shadow: 'none'
                                }}
                                _active={{
                                    bg: 'transparent',
                                    transform: 'none'
                                }}
                                onClick={() => {
                                    onSelect(task);
                                console.log(task);
                                console.log(task.id);
                                console.log(selectedTask);
                                }
                                }
                                zIndex={1}
                            />
                        </Box>
                    ))}
                </VStack>
            </Box>
        </Box>
    );
};

export default TaskList;