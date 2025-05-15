import React from 'react';
import {
    Box,
    Text,
    VStack,
    HStack,
    Checkbox,
    Button,
    Select,
    Badge,
    useColorModeValue,
    IconButton,
    Divider
} from '@chakra-ui/react';
import { useEffect, useState, useMemo } from 'react';
import { ArrowDownIcon, ArrowUpIcon, TimeIcon } from '@chakra-ui/icons';
import {getTasks, updateTask} from './services/tasksAPI.js';
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

const groupTasksByDate = (tasks) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const endOfWeek = new Date(today);
    endOfWeek.setDate(endOfWeek.getDate() + (7 - today.getDay()));

    const nextWeekStart = new Date(endOfWeek);
    nextWeekStart.setDate(nextWeekStart.getDate() + 1);

    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekEnd.getDate() + 7);

    const groups = {
        overdue: { title: "Просроченные", tasks: [] },
        today: { title: "Сегодня", tasks: [] },
        tomorrow: { title: "Завтра", tasks: [] },
        thisWeek: { title: "На этой неделе", tasks: [] },
        nextWeek: { title: "Следующая неделя", tasks: [] },
        future: { title: "Позже", tasks: [] },
        noDate: { title: "Без даты", tasks: [] }
    };

    tasks.forEach(task => {
        if (!task.dueDate) {
            groups.noDate.tasks.push(task);
            return;
        }

        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);

        if (taskDate < today) {
            groups.overdue.tasks.push(task);
        } else if (taskDate.getTime() === today.getTime()) {
            groups.today.tasks.push(task);
        } else if (taskDate.getTime() === tomorrow.getTime()) {
            groups.tomorrow.tasks.push(task);
        } else if (taskDate <= endOfWeek) {
            groups.thisWeek.tasks.push(task);
        } else if (taskDate >= nextWeekStart && taskDate <= nextWeekEnd) {
            groups.nextWeek.tasks.push(task);
        } else {
            groups.future.tasks.push(task);
        }
    });
    
    Object.values(groups).forEach(group => {
        group.tasks.sort((a, b) => {
            const dateA = a.dueDate ? new Date(a.dueDate) : null;
            const dateB = b.dueDate ? new Date(b.dueDate) : null;
            if (!dateA && !dateB) return 0;
            if (!dateA) return 1;
            if (!dateB) return -1;
            return dateA - dateB;
        });
    });

    return Object.values(groups).filter(group => group.tasks.length > 0);
};

const GroupedTaskList = ({selectedTask, onSelect, tasks, setTasks}) => {

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({
        field: 'dueDate',
        direction: 'asc'
    });

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
    const groupHeaderBg = useColorModeValue('gray.100', 'gray.800');

    const handleSortChange = (e) => {
        const [field, direction] = e.target.value.split('-');
        setSortConfig({ field, direction });
    };

    const sortedTasks = useMemo(() => {
        const tasksCopy = [...tasks];

        return tasksCopy.sort((a, b) => {
            if (sortConfig.field === 'dueDate') {
                const dateA = a.dueDate ? new Date(a.dueDate) : null;
                const dateB = b.dueDate ? new Date(b.dueDate) : null;
                
                if (!dateA && !dateB) return 0;
                if (!dateA) return 1;
                if (!dateB) return -1;

                return sortConfig.direction === 'asc'
                    ? dateA - dateB
                    : dateB - dateA;
            }
            
            if (sortConfig.field === 'priority') {
                const priorityOrder = { High: 1, Medium: 2, Low: 3 };
                return sortConfig.direction === 'asc'
                    ? priorityOrder[a.priority] - priorityOrder[b.priority]
                    : priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            
            if (sortConfig.field === 'condition') {
                return sortConfig.direction === 'asc'
                    ? (a.condition === b.condition ? 0 : a.condition ? 1 : -1)
                    : (a.condition === b.condition ? 0 : a.condition ? -1 : 1);
            }

            return 0;
        });
    }, [tasks, sortConfig]);

    const groupedTasks = useMemo(() => {
        return groupTasksByDate(sortedTasks);
    }, [sortedTasks]);
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleTaskComplete = async (task) => {
        try {
            setTasks(prevTasks =>
                prevTasks.map(t =>
                    t.id === task.id ? { ...t, condition: !t.condition } : t
                )
            );
            
            await updateTask({ ...task, condition: !task.condition });

        } catch (error) {
            setTasks(prevTasks =>
                prevTasks.map(t =>
                    t.id === task.id ? { ...t, condition: t.condition } : t
                )
            );
            console.error("Ошибка:", error);
        }
    };

    const toggleSortDirection = () => {
        setSortConfig(prev => ({
            ...prev,
            direction: prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleFieldChange = (e) => {
        setSortConfig({
            field: e.target.value,
            direction: 'asc'
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
            <Text fontSize="2xl" fontWeight="bold">Список задач</Text>
            
            <Box maxH="calc(100vh - 200px)"
                 overflowY="auto"
                 pr={1.5}>
                <VStack spacing={6} align="stretch">
                    {groupedTasks.map((group, index) => (
                        <Box key={index}>
                            <Text
                                fontSize="lg"
                                fontWeight="bold"
                                mb={2}
                                p={2}
                                bg={groupHeaderBg}
                                borderRadius="md"
                                >
                                {group.title} ({group.tasks.length})
                            </Text>
                            <VStack spacing={4} align="stretch">
                                {group.tasks.map((task) => (
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
                                                onChange={(e) => handleTaskComplete(task)}
                                                zIndex={2}
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
                            {index < groupedTasks.length - 1 && <Divider my={4} />}
                        </Box>
                        ))}
                </VStack>
            </Box>
        </Box>
    );
};

export default GroupedTaskList;