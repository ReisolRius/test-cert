import logo from './logo.svg';
import './App.css';
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom';
import {Routes, Route, Link, useParams} from 'react-router-dom'

import Main from './components/Main/Main'
import Info from './components/Info/Info'
import Pay from './components/Pay/Pay'

function App() {
  return (
    <BrowserRouter basename='/testCert'>
      <div className='container'>
        <Routes>
          <Route path='/' element={<Main/>} />
          <Route path='Info/' element={<Info/>} />
          <Route path='Pay/' element={<Pay/>} />
        </Routes>
      </div>
  </BrowserRouter>
  );
}

export default App;
