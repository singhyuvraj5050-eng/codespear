import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Login from "./components/auth/Login"
import SignUp from "./components/auth/SignUp"
import Landing from "./components/landing/Landing"
import Dashboard from "./components/dashboard/Dashboard"
import Profile from "./components/user/Profile"
import Repo from "./components/repo/Repo"
import Issues from "./components/issues/Issues"
import Chat from "./components/chat/Chat"

function App() {


  return (
<Router>
<Routes>
<Route path="/" element= {<Landing/>}/>    
<Route path="/auth" element= {<Login/>}/>    
<Route path="/signup" element= {<SignUp/>}/> 
<Route path="/dashboard" element= {<Dashboard/>} />  
<Route path="/profile" element= {<Profile/>} /> 
<Route path="/repo" element={<Repo/>}/>
<Route path="/issues" element={<Issues/>}/>
<Route path="/chat" element= {<Chat/>}/>
</Routes>
</Router>
  )
}

export default App
