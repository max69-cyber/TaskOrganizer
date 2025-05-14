import { useEffect, useState } from 'react';
import './App.css';
import { Flex, Box } from "@chakra-ui/react";
import Sidebar from "./Sidebar.jsx";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TaskList from "@/TaskList.jsx";
import LoginPage from "@/LoginPage.jsx";
import EditTask from "@/EditTask.jsx";
import CreateTask from "@/CreateTask.jsx";

function App() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isAuthorised, setAuthorised] = useState(!!localStorage.getItem('token'));
    const [selectedTask, setSelectedTask] = useState(null);
    const [tasks, setTasks] = useState([]);

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

    const handleTaskDeleted = (deletedTaskId) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== deletedTaskId));
    };
    
    return (
        <Router>
            <Flex className="h-screen">
                {isAuthorised && (
                    <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} isAuthorised={isAuthorised} onLogout={handleLogout} selectedTask={selectedTask} onDelete={handleTaskDeleted}/>
                )}

                <Box flex="1" p={4} display="flex" justifyContent="center" alignItems="center">
                    <Routes>
                        {!isAuthorised ? (
                            <Route path="/login" element={<LoginPage setAuthorised={setAuthorised} />} />
                        ) : (
                            <>
                                <Route path="/" element={<Navigate to="/tasks" />} />2
                                <Route path="/tasks" element={<TaskList selectedTask={selectedTask} onSelect={setSelectedTask} tasks={tasks} setTasks={setTasks} />} />
                                <Route path="/edit" element={<EditTask task={selectedTask}/>} />
                                <Route path="/create" element={<CreateTask/>} />
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