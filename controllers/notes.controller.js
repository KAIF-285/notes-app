const Note = require("../models/note.model")

exports.listNotes = async (req,res)=>{
  try{
    const notes = await Note.find({ userId: req.user.id }).sort({updatedAt:-1})
    return res.status(200).send(notes)
  }catch(err){
    console.error("Error listing notes",err)
    return res.status(500).send({message:"Failed to fetch notes"})
  }
}

exports.createNote = async (req,res)=>{
  try{
    if(!req.body.title){
      return res.status(400).send({message:"title is required"})
    }
    const note = await Note.create({
      userId: req.user.id,
      title: req.body.title,
      content: req.body.content || ""
    })
    return res.status(201).send(note)
  }catch(err){
    console.error("Error creating note",err)
    return res.status(500).send({message:"Failed to create note"})
  }
}

exports.deleteNote = async (req,res)=>{
  try{
    const id = req.params.id
    const note = await Note.findOne({_id:id, userId:req.user.id})
    if(!note){
      return res.status(404).send({message:"Note not found"})
    }
    await Note.deleteOne({_id:id})
    return res.status(204).send()
  }catch(err){
    console.error("Error deleting note",err)
    return res.status(500).send({message:"Failed to delete note"})
  }
}


