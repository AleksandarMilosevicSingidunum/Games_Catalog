import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import AddGame from "./pages/AddGame";
import EditGame from "./pages/EditGame";
import AddDevPlat from "./pages/AddDevPlat";
import ViewGame from "./pages/ViewGame"; // Import the ViewGame component

function App() {
  return (
    <div className='App'>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/addgame' element={<AddGame />} />
          <Route exact path="/adddevplat" element={<AddDevPlat />} />
          <Route exact path='/editgame/:gameId' element={<EditGame />} />
          <Route exact path='/viewgame/:gameId' element={<ViewGame />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
