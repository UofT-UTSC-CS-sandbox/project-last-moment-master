import Login from './components/pages/Login/Login.jsx'
import SignUp from './components/pages/SignUp/SignUp.jsx';
import AuthPage from './components/pages/AuthPage/AuthPage.jsx';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

function App() {
  return (
    <div>
      <h1 className="text-5xl text-green-400">Skill Vitrine</h1>
      <BrowserRouter>
        <Login />
        <SignUp />
        <AuthPage />
      </BrowserRouter>
    </div>
  );
}

export default App;
