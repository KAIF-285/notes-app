module.exports={
    DB_NAME : process.env.DB_NAME || "notes_db",
    DB_URL : process.env.MONGODB_URI || "mongodb://localhost/notes_db"
}