import { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

const NotificationSystem = (tasks) => {
    const toast = useToast();

    useEffect(() => {
        const checkDeadlines = () => {
            const now = new Date();
            const reminderTime = Number(localStorage.getItem('reminderTime'));

            if (reminderTime > 0) {
                tasks.forEach((task) => {
                    const deadline = new Date(task.dueDate);
                    const timeLeft = (deadline - now) / (1000 * 60 * 60);

                    if (timeLeft > 0 && timeLeft <= reminderTime) {
                        toast({
                            title: `Скоро истекает срок: ${task.title}`,
                            description: `Осталось менее ${reminderTime} часов!`,
                            status: 'warning',
                            duration: 3000,
                            isClosable: true,
                        });
                    }
                });
            }
        };
        
        const interval = setInterval(checkDeadlines, 60000);
        return () => clearInterval(interval);
    }, [tasks, toast]);
};

export default NotificationSystem;
