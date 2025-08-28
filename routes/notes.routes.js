const notesController=require("../controllers/notes.controller")
const authMW=require("../middlewares/auth.mw")

module.exports=(app)=>{
    app.get("/api/v1/notes", authMW.verifyToken, notesController.listNotes)
    app.post("/api/v1/notes", authMW.verifyToken, notesController.createNote)
    app.delete("/api/v1/notes/:id", authMW.verifyToken, notesController.deleteNote)
}


