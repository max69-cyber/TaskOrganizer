import { Alert, AlertIcon, Box, useColorModeValue, VStack, Input, Button, Text } from '@chakra-ui/react';
import {useState, useEffect} from 'react';
import ErrorPage from "@/ErrorPage.jsx";
import {getTasks} from "@/services/tasksAPI.js";
import {tryAuthorise} from "@/services/authorisation.js";
import { useNavigate } from 'react-router-dom';

const LoginPage = ({setAuthorised}) => {
    const bgColor = useColorModeValue('white', 'gray.700');
    const completedColor = useColorModeValue('gray.200', 'gray.600');

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            console.log(login, password);
            const data = await tryAuthorise(login, password);
            localStorage.setItem('token', data.token);
            setError('');
            setAuthorised(true);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };
    
    return (
        <Box  minH="100vh"
              display="flex"
              alignItems="center"
              justifyContent="center"
              p={4}>
            <VStack spacing={4} p={8} bg={bgColor} boxShadow="md" borderRadius="md">
                <Text fontSize="2xl" mb={2}>Вход в систему</Text>
                {error && (
                    <Alert status="error">
                        <AlertIcon />
                        {error}
                    </Alert>
                )}
                <Input
                    placeholder="Логин"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    variant="filled"
                />
                <Input
                    placeholder="Пароль"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="filled"
                />
                <Button colorScheme="teal" onClick={handleLogin} w="full">
                    Войти
                </Button>
                
            </VStack>
        </Box>
    );
};

export default LoginPage;