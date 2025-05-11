import { useEffect, useState } from 'react';
import './App.css';
import { Flex, Box } from "@chakra-ui/react";
import Sidebar from "./Sidebar.jsx";
import Authorisation from "./Authorisation.jsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };
    
    return (
        <Router>
            <Flex className="h-screen">
                <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
                
                <Box flex="1" p={4}>
                    <Routes>
                        <Route path="/authorisation" element={<Authorisation />} />
                    </Routes>
                </Box>
            </Flex>
        </Router>
    );
}

export default App;