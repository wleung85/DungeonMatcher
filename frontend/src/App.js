import './App.css';
// import { BrowserRouter } from 'react-router-dom';
import { useState } from 'react';
// import Main from './components/MainComponent';
// import Login from './pages/login/Login';
import Header from './components/HeaderComponent';
import Lfg from './pages/lfg/Lfg';

const exampleUser = {
  userId: 'userIdExample',
  username: 'wleung85',
}


function App() {
  const [user, setUser] = useState(exampleUser);

  return (
    <div className="App">
      <Header user={user}/>
      <Lfg />
    </div>
  );
}

export default App;
