import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {ToastContainer,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App.jsx'
 
createRoot(document.getElementById('root')).render(

  <StrictMode>
    <App />
      <ToastContainer position="bottom-right"
   autoClose={3000}
  theme="dark"
  toastStyle={{
    borderRadius: "10px",
    fontSize: "14px"
  }} />
  </StrictMode>,
)
