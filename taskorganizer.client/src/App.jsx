import { useEffect, useState } from 'react';
import './App.css';
import { Flex, Box } from "@chakra-ui/react";
import Sidebar from "./Sidebar.jsx";
import Authorisation from "./Authorisation.jsx";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TaskList from "@/TaskList.jsx";
import LoginPage from "@/LoginPage.jsx";
import EditTask from "@/EditTask.jsx";

function App() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isAuthorised, setAuthorised] = useState(!!localStorage.getItem('token'));
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuthorised(true);
        }
    }, []);
    
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuthorised(false);
    };
    
    return (
        <Router>
            <Flex className="h-screen">
                {isAuthorised && (
                    <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} isAuthorised={isAuthorised} onLogout={handleLogout} />
                )}

                <Box flex="1" p={4} display="flex" justifyContent="center" alignItems="center">
                    <Routes>
                        {!isAuthorised ? (
                            <Route path="/login" element={<LoginPage setAuthorised={setAuthorised} />} />
                        ) : (
                            <>
                                <Route path="/" element={<Navigate to="/tasks" />} />2
                                <Route path="/tasks" element={<TaskList selectedTask={selectedTask} onSelect={setSelectedTask}/>} />
                                <Route path="/edit" element={<EditTask task={selectedTask}/>} />
                            </>
                        )}
                        {!isAuthorised && <Route path="*" element={<Navigate to="/login" />} />}
                    </Routes>
                </Box>
            </Flex>
        </Router>
    );
}

export default App;