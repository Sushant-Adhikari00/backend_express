const asyncHandler = require("express-async-handler")

let notes = [];

//@desc Get all notes 
//@route GET /api/notes
//@access public 

const getNotes =asyncHandler( async(req,res)=>{
    res.status(200).json(notes);
});

//@desc Create new notes 
//@route POST /api/notes
//@access public 

const createNote = asyncHandler(async(req,res)=>{
    console.log("the request body is :", req.body);
    const {nam} = req.body;
    if(!nam){
        res.status(400);
        throw new Error("All fields fillup");
    }
    const note = { id: Date.now().toString(), nam };
    notes.push(note);
    res.status(201).json(note);
});


//@desc Get notes 
//@route GET /api/notes/:id
//@access public 

const getNote = asyncHandler(async(req,res)=>{
    const note = notes.find(n => n.id === req.params.id);
    if (!note) {
        res.status(404);
        throw new Error("Note not found");
    }
    res.status(200).json(note);
});


//@desc Update notes 
//@route PUT /api/notes/:id
//@access public 

const updateNote = asyncHandler(async(req,res)=>{
    const note = notes.find(n => n.id === req.params.id);
    if (!note) {
        res.status(404);
        throw new Error("Note not found");
    }
    const { nam } = req.body;
    if(!nam){
        res.status(400);
        throw new Error("Name field is required");
    }
    note.nam = nam;
    res.status(200).json(note);
});


//@desc Delete notes 
//@route DELETE /api/notes/:id
//@access public 

const deleteNote = asyncHandler(async(req,res)=>{
    const noteIndex = notes.findIndex(n => n.id === req.params.id);
    if (noteIndex === -1) {
        res.status(404);
        throw new Error("Note not found");
    }
    notes.splice(noteIndex, 1);
    res.status(200).json({ message: `Note with id ${req.params.id} has been deleted` });
});


module.exports = {
    getNotes,
    createNote,
    getNote,
    updateNote,
    deleteNote,
};