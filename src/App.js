import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import NoteState from './context/notes/NoteState';
import Signup from './components/Signup';
import Login from './components/Login';

function App() {
  return (
    <>
      <NoteState>
        <Router>
          <Navbar />
          {/* <Alert message="This is amazing React course" /> */}
          <div className="container">
          <Routes>
            <Route exact path="/" element = {<Home />}> </Route>
            <Route exact path="/about" element = {<About />}> </Route>
            <Route exact path="/login" element = {<Login />}> </Route>
            <Route exact path="/signup" element = {<Signup />}> </Route>
          </Routes>
          </div>
        </Router>
      </NoteState>
    </>
  );
}
//In this we have used react-router-dom concurrently to start backend and react application simultaneously
export default App;