import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Main from './components/MainComponent';
import Login from './pages/login/Login';

function App() {
  return (
    <div className="App">
      <Login />
    </div>
  );
}

export default App;
