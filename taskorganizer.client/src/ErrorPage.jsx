import { Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton, Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';
const ErrorPage = ( {error} ) => {
    const bgColor = useColorModeValue('white', 'gray.700');
    const completedColor = useColorModeValue('gray.200', 'gray.600');
    
    return (
        <Box>
            <Alert
                status="error"
                variant="subtle"
                borderRadius="md"
                boxShadow="lg"
                alignItems="flex-start"
            >
                <Flex width="100%" justifyContent="space-between" alignItems="center">
                    <Flex>
                        <AlertIcon boxSize="5" mr={3} />
                        <Box>
                            <AlertTitle fontSize="lg" lineHeight="6">
                                Ошибка загрузки данных
                            </AlertTitle>
                            <AlertDescription fontSize="md" mt={1}>
                                {typeof error === 'string' ? error : error.message || 'Произошла неизвестная ошибка'}
                            </AlertDescription>
                        </Box>
                    </Flex>
                </Flex>
            </Alert>
        </Box>
    );
};

export default ErrorPage;