import React from 'react';
import { Box, Button, IconButton, useColorMode, useColorModeValue, HStack, VStack, Flex, Avatar, Text } from '@chakra-ui/react';
import { SunIcon, MoonIcon, SearchIcon, AddIcon, EditIcon, DeleteIcon, BellIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import LogoutIcon from "./assets/LogoutIcon.jsx";
import ChevroneLeft from "./assets/ChevroneLeft.jsx";
import ChevroneRight from "./assets/ChevroneRight.jsx";
import LoginIcon from "@/assets/LoginIcon.jsx";
import { jwtDecode } from "jwt-decode";
import HomeIcon from "@/assets/HomeIcon.jsx";

const Sidebar = ({ isOpen, onToggle, isAuthorised, onLogout }) => {
    const { colorMode, toggleColorMode } = useColorMode();
    const bg = useColorModeValue('gray.100', 'gray.900');
    const color = useColorModeValue('gray.800', 'white');
    
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);

    return (
        <Box
            bg={bg}
            color={color}
            w={isOpen ? '250px' : '40px'}
            className="h-full p-2 shadow-lg"
            display="flex"
            flexDirection="column"
        >
            <Flex justify="flex-end" align="right" mb={4} gap={2}>
                {isOpen && (
                    <IconButton
                        aria-label="Toggle Theme"
                        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                        bg={bg}
                        onClick={toggleColorMode}
                        size="s"
                    />
                )}

                <IconButton
                    aria-label="Toggle Sidebar"
                    icon={isOpen ? <ChevroneLeft  /> : <ChevroneRight/>}
                    bg={bg}
                    onClick={onToggle}
                    size="xs"
                />
            </Flex>

            {isOpen && (
                <Flex direction="column" p={2} flex="1" 
                      borderTopWidth="1px" 
                      borderTopColor={useColorModeValue('gray.200', 'gray.700')}
                >
                    <VStack align="start" spacing={1} w="full">
                        <Link to="/tasks" style={{ width: '100%' }}>
                            <Button
                                variant="ghost"
                                size="sm"
                                color={useColorModeValue('gray.800', 'white')}
                                _hover={{ bg: useColorModeValue('gray.300', 'gray.700') }}
                                fontSize="s"
                                w="full"
                                rounded="lg"
                                justifyContent="flex-start"
                                leftIcon={<HomeIcon/>}
                            >
                                Главная
                            </Button>
                        </Link>
                        
                        <Link to="/doctors" style={{ width: '100%' }}>
                            <Button
                                variant="ghost"
                                size="sm"
                                color={useColorModeValue('gray.800', 'white')}
                                _hover={{ bg: useColorModeValue('gray.300', 'gray.700') }}
                                fontSize="s"
                                w="full"
                                rounded="lg"
                                justifyContent="flex-start"
                                leftIcon={<SearchIcon/>}
                            >
                                Поиск
                            </Button>
                        </Link>
                        
                        <Link to="/doctors" style={{ width: '100%' }}>
                            <Button
                                variant="ghost"
                                size="sm"
                                color={useColorModeValue('gray.800', 'white')}
                                _hover={{ bg: useColorModeValue('gray.300', 'gray.700') }}
                                fontSize="s"
                                w="full"
                                rounded="lg"
                                justifyContent="flex-start"
                                leftIcon={<AddIcon/>}
                            >
                                Добавить
                            </Button>
                        </Link>

                        <Link to="/edit" style={{ width: '100%' }}>
                            <Button
                                variant="ghost"
                                size="sm"
                                color={useColorModeValue('gray.800', 'white')}
                                _hover={{ bg: useColorModeValue('gray.300', 'gray.700') }}
                                fontSize="s"
                                w="full"
                                rounded="lg"
                                justifyContent="flex-start"
                                leftIcon={<EditIcon/>}
                            >
                                Редактировать
                            </Button>
                        </Link>

                        <Link to="/doctors" style={{ width: '100%' }}>
                            <Button
                                variant="ghost"
                                size="sm"
                                color={useColorModeValue('gray.800', 'white')}
                                _hover={{ bg: useColorModeValue('gray.300', 'gray.700') }}
                                fontSize="s"
                                w="full"
                                rounded="lg"
                                justifyContent="flex-start"
                                leftIcon={<DeleteIcon/>}
                            >
                                Удалить
                            </Button>
                        </Link>

                        <Link to="/doctors" style={{ width: '100%' }}>
                            <Button
                                variant="ghost"
                                size="sm"
                                color={useColorModeValue('gray.800', 'white')}
                                _hover={{ bg: useColorModeValue('gray.300', 'gray.700') }}
                                fontSize="s"
                                w="full"
                                rounded="lg"
                                justifyContent="flex-start"
                                leftIcon={<BellIcon/>}
                            >
                                Напоминание
                            </Button>
                        </Link>
                    </VStack>

                    {isAuthorised && (
                    <Box mt="auto" pt={2} borderTopWidth="1px" borderTopColor={useColorModeValue('gray.200', 'gray.700')}>
                        <Flex align="center" justify="space-between" w="full">
                            <Link to="/doctors" style={{ width: '100%' }}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    color={useColorModeValue('gray.800', 'white')}
                                    _hover={{ bg: useColorModeValue('gray.300', 'gray.700') }}
                                    fontSize="s"
                                    w="48"
                                    rounded="lg"
                                    justifyContent="flex-start"
                                    p={2}
                                >
                                    <HStack spacing={2} flex="1" overflow="hidden">
                                        <Avatar
                                            size="sm"
                                            src={decodedToken.FullName === "Мария Попова" ? "https://images.steamusercontent.com/ugc/2035107099039727169/7C003E5AF14BDE9E56D55C05A4D05E398FE607BC/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false" : "https://bit.ly/dan-abramov"} //XDDD
                                            
                                        />
                                        <Box overflow="hidden">
                                            <Text fontSize="sm" fontWeight="medium" isTruncated>{decodedToken.FullName}</Text>
                                            <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')} isTruncated>
                                                {decodedToken.Email}
                                            </Text>
                                        </Box>
                                    </HStack>
                                </Button>
                            </Link>
                            
                            <IconButton
                                aria-label="Выйти"
                                icon={<LogoutIcon/>}
                                size="xs"
                                variant="ghost"
                                color={color}
                                _hover={{ bg: useColorModeValue('gray.300', 'gray.700')  }}
                                ml={2}
                                onClick={onLogout}
                            />
                        </Flex>
                    </Box>
                        )}

                    {!isAuthorised && (
                        <Box mt="auto" pt={2} borderTopWidth="1px" borderTopColor={useColorModeValue('gray.200', 'gray.700')}>
                            <Flex align="center" justify="space-between" w="full">
                                <Link to="/login" style={{ width: '100%' }}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        color={useColorModeValue('gray.800', 'white')}
                                        _hover={{ bg: useColorModeValue('gray.300', 'gray.700') }}
                                        fontSize="s"
                                        w="full"
                                        rounded="lg"
                                        justifyContent="flex-start"
                                        p={5}
                                        leftIcon={<LoginIcon/>}
                                    >
                                        <Text fontSize="s">Вход / Регистрация</Text> 
                                    </Button>
                                </Link>
                            </Flex>
                        </Box>
                    )}
                    
                </Flex>
            )}
        </Box>
    );
};

export default Sidebar;