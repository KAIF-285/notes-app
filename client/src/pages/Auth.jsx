import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import '../styles/auth.css'

export default function Auth(){
  const [mode,setMode] = useState('password') // password | otp | google
  const [form,setForm] = useState({ name:'', userId:'', email:'', password:'', otp:'', dob:'' })
  const [message,setMessage] = useState('')
  const [error,setError] = useState('')
  const navigate = useNavigate()

  const onChange = (e)=> setForm({...form,[e.target.name]:e.target.value})

  const handleSignup = async ()=>{
    setError(''); setMessage('')
    if(!form.name || !form.userId || !form.email || !form.password || !form.dob){
      setError('Please fill in name, user ID, email, date of birth and password.');
      return;
    }
    try{
      const res = await api.post('/notes/api/v1/auth/signup', { ...form, provider:'password' })
      setMessage('Signup successful. You can sign in now.')
    }catch(e){ setError(e?.response?.data?.message || 'Signup failed') }
  }

  const handleSignin = async ()=>{
    setError(''); setMessage('')
    if(!form.userId || !form.password){ setError('User ID and password are required.'); return }
    try{
      const res = await api.post('/notes/api/v1/auth/signin', { userId: form.userId, password: form.password })
      localStorage.setItem('token', res.data.accessToken)
      localStorage.setItem('user', JSON.stringify(res.data))
      navigate('/notes')
    }catch(e){ setError(e?.response?.data?.message || 'Login failed') }
  }

  const requestOtp = async ()=>{
    setError(''); setMessage('')
    if(!form.email){ setError('Email is required for OTP.'); return }
    try{
      const res = await api.post('/notes/api/v1/auth/request-otp', { email: form.email, name: form.name, userId: form.userId, dob: form.dob })
      setMessage('OTP sent: ' + res.data.otp)
    }catch(e){ setError(e?.response?.data?.message || 'OTP request failed') }
  }

  const verifyOtp = async ()=>{
    setError(''); setMessage('')
    if(!form.email || !form.otp){ setError('Email and OTP are required.'); return }
    try{
      const res = await api.post('/notes/api/v1/auth/verify-otp', { email: form.email, otp: form.otp })
      localStorage.setItem('token', res.data.accessToken)
      localStorage.setItem('user', JSON.stringify(res.data))
      navigate('/notes')
    }catch(e){ setError(e?.response?.data?.message || 'OTP verify failed') }
  }

  const googleLogin = async ()=>{
    setError(''); setMessage('')
    try{
      // For assignment demo, simulate an ID token payload
      const payload = btoa(JSON.stringify({ email: form.email, sub: 'fake-google-sub', name: form.name || form.email }))
      const token = 'header.'+payload+'.sig'
      const res = await api.post('/notes/api/v1/auth/google', { idToken: token, name: form.name })
      localStorage.setItem('token', res.data.accessToken)
      localStorage.setItem('user', JSON.stringify(res.data))
      navigate('/notes')
    }catch(e){ setError(e?.response?.data?.message || 'Google login failed') }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-brand"><span className="logo"/> <strong>HD</strong></div>
        <div className="auth-title">Sign up</div>
        <div className="auth-subtitle">Sign up to enjoy the feature of HD</div>

        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}

        <div style={{display:'flex', gap:8, marginBottom:10}}>
          <button className="btn" style={{background: mode==='password'?'#2b6bff':'#94a3b8'}} onClick={()=>setMode('password')}>Password</button>
          <button className="btn" style={{background: mode==='otp'?'#2b6bff':'#94a3b8'}} onClick={()=>setMode('otp')}>OTP</button>
          <button className="btn" style={{background: mode==='google'?'#2b6bff':'#94a3b8'}} onClick={()=>setMode('google')}>Google</button>
        </div>

        {(mode==='password' || mode==='otp') && (
          <>
            <div className="field">
              <label className="label">Your Name</label>
              <input className="input" name="name" placeholder="Jonas Khanwald" value={form.name} onChange={onChange}/>
            </div>
            <div className="field">
              <label className="label">User ID</label>
              <input className="input" name="userId" placeholder="jonas" value={form.userId} onChange={onChange}/>
            </div>
            <div className="field">
              <label className="label">Email</label>
              <input className="input" name="email" placeholder="jonas_kahnwald@gmail.com" value={form.email} onChange={onChange}/>
            </div>
            <div className="field">
              <label className="label">Date of Birth</label>
              <input className="input" type="date" name="dob" value={form.dob} onChange={onChange}/>
            </div>
          </>
        )}

        {mode==='password' && (
          <>
            <div className="field">
              <label className="label">Password</label>
              <input className="input" type="password" name="password" placeholder="••••••••" value={form.password} onChange={onChange}/>
            </div>
            <button className="btn" onClick={handleSignup} style={{marginTop:8}}>Create account</button>
            <div className="muted">Already have an account? <span className="link" onClick={handleSignin}>Sign in</span></div>
          </>
        )}

        {mode==='otp' && (
          <>
            <button className="btn" onClick={requestOtp} style={{marginTop:8, marginBottom:8}}>Get OTP</button>
            <div className="field">
              <label className="label">Enter OTP</label>
              <input className="input" name="otp" placeholder="6-digit code" value={form.otp} onChange={onChange}/>
            </div>
            <button className="btn" onClick={verifyOtp}>Verify OTP</button>
            <div className="muted">Already have an account? <span className="link" onClick={()=>setMode('password')}>Sign in</span></div>
          </>
        )}

        {mode==='google' && (
          <>
            <div className="field">
              <label className="label">Google Email</label>
              <input className="input" name="email" placeholder="you@gmail.com" value={form.email} onChange={onChange}/>
            </div>
            <button className="btn" onClick={googleLogin}>Continue with Google</button>
          </>
        )}
      </div>
    </div>
  )
}


