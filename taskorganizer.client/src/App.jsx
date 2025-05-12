import { useEffect, useState } from 'react';
import './App.css';
import { Flex, Box } from "@chakra-ui/react";
import Sidebar from "./Sidebar.jsx";
import Authorisation from "./Authorisation.jsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaskList from "@/TaskList.jsx";

function App() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };
    
    return (
        <Router>
            <Flex className="h-screen" justifyContent="center" alignItems="center">
                <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

                <Box
                    flex="1"
                    p={4}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <TaskList />
                </Box>
            </Flex>
        </Router>
    );
}

export default App;