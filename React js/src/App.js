import './App.css';
import TodoForm from './components/TodoForm';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import TasksList from './components/TasksList';
import Error from './pages/Error';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<TodoForm />} />
        <Route path="/tasks" element={<TasksList />} />
        <Route path="/error" element={<Error />} />
        <Route path="/*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
