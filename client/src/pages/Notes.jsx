import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Notes(){
  const [notes,setNotes] = useState([])
  const [title,setTitle] = useState('')
  const [content,setContent] = useState('')
  const [error,setError] = useState('')
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  useEffect(()=>{
    if(!token){ navigate('/auth'); return }
    fetchNotes()
  },[])

  async function fetchNotes(){
    try{
      const res = await api.get('/api/v1/notes')
      setNotes(res.data)
    }catch(e){ setError(e?.response?.data?.message || 'Failed to load notes') }
  }

  async function createNote(){
    setError('')
    try{
      await api.post('/api/v1/notes', { title, content })
      setTitle(''); setContent('')
      fetchNotes()
    }catch(e){ setError(e?.response?.data?.message || 'Failed to create') }
  }

  async function deleteNote(id){
    setError('')
    try{
      await api.delete('/api/v1/notes/'+id)
      fetchNotes()
    }catch(e){ setError(e?.response?.data?.message || 'Failed to delete') }
  }

  function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth')
  }

  return (
    <div style={{maxWidth:820, margin:'24px auto', padding:16}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2 style={{margin:0}}>Your Notes</h2>
        <button className="btn" onClick={logout} style={{width:'auto', padding:'10px 14px'}}>Logout</button>
      </div>
      {error && <div className="error" style={{marginTop:10}}>{error}</div>}
      <div style={{display:'grid', gap:8, margin:'14px 0'}}>
        <input className="input" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <textarea className="input" style={{minHeight:100}} placeholder="Content" value={content} onChange={(e)=>setContent(e.target.value)} />
        <button className="btn" onClick={createNote}>Add Note</button>
      </div>
      <div style={{display:'grid', gap:8}}>
        {notes.map(n=> (
          <div key={n._id} style={{border:'1px solid #e5e7eb', padding:12, borderRadius:10, background:'#fff'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <strong>{n.title}</strong>
              <button className="btn" onClick={()=>deleteNote(n._id)} style={{width:'auto', padding:'8px 12px', background:'#ef4444'}}>Delete</button>
            </div>
            <div style={{whiteSpace:'pre-wrap', color:'#374151', marginTop:6}}>{n.content}</div>
          </div>
        ))}
      </div>
    </div>
  )
}


