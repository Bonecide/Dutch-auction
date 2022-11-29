import './App.css';
import ConnectWallet from './components/ConnectWallet/ConnectWallet';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import AddAuc from './components/AddAuc/AddAuc';
import Auc from './components/Auc/Auc';

function App() {
  const isAuth = useSelector((s) => s.auth.isAuth)
  return (
    <>
     {
      !isAuth ? (
        <ConnectWallet/>
      ) :
      <Routes>
        <Route path='/' element={<Auc/>} />
        <Route path='/add' element={<AddAuc/>}/>
      </Routes>
     }
    </>
  );
}

export default App;
