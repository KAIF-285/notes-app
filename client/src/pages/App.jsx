import { Link, useNavigate } from 'react-router-dom'
import '../App.css'

export default function App(){
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  return (
    <div style={{padding:24}}>
      <h2>Welcome to Notes App</h2>
      <p>Please sign up or log in to continue.</p>
      <div style={{display:'flex', gap:12}}>
        <Link to="/auth">Sign up / Login</Link>
        {token && <button onClick={()=>navigate('/notes')}>Go to Notes</button>}
      </div>
    </div>
  )
}


