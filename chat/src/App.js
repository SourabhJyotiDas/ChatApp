
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Join from "./component/Join/Join";
import Chat from "./component/Chat/Chat"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Join />} />
        <Route exact path="/chat" element={<Chat />} />
      </Routes>
      <ToastContainer />
    </Router>

  );
}

export default App;
