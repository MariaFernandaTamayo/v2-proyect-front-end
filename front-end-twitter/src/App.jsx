import { BrowserRouter,Routes,Route } from "react-router-dom"
import {RegisterPage} from "./pages/RegisterPage"

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home </h1>} />
        <Route path="/register" element={<RegisterPage/>} />
        
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
