
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css'
import SignIn from './SignIn';
import Dashboard from './Dashboard';

function App() {


  return (
    <Router>
      <div className="App">
     <Routes>
     <Route path='/' element={<SignIn />} />
     <Route path='/dashboard' element={<Dashboard />} />
     </Routes>
      </div>
    </Router>
  )
}

export default App
