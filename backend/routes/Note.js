const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
//Route 1 : Get all the notes : GET "/api/notes/fetchallnotes". Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes); 
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured");
    }
});

//Route 2 : Adding the notes : POST "/api/notes/addnote". Login required
router.post("/addnote", fetchuser, [
    body("title", "Enter a Title").isLength({ min: 3 }),
    body("description", "Description should be atleast 4 characters").isLength({min: 4,}),
], async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //If there are errors,return bad requests and errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Notes({
        title, description, tag, user: req.user.id,
      });
      const savenote = await note.save();
      res.json(savenote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured");
    }
});

//Route 3 : Update the existing notes : PUT "/api/notes/updatenote". Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
   const {title, description, tag} = req.body;
   try {
   //Create a newNote object
   const newNote = {};
   if(title){newNote.title = title};
   if(description){newNote.description = description};
   if(tag){newNote.tag = tag};
  // Find the note to be updated and update it
  let note = await Notes.findById(req.params.id);
  if(!note){res.status(404).send("Not found")};
  if(note.user.toString() !== req.user.id){
    return res.status(401).send("Not Allowed")
  }

  note = await Notes.findByIdAndUpdate(req.params.id, {$set : newNote}, {new : true})
  res.json({note});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
}});

//Route 4 : Delete the existing notes : DELETE "/api/notes/deletenote". Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
  // Find the note to be deleted and delete it
  let note = await Notes.findById(req.params.id);
  if(!note){res.status(404).send("Not found")};
  //Allow deletion only if user owns this note
  if(note.user.toString() !== req.user.id){
    return res.status(401).send("Not Allowed")
  }
  note = await Notes.findByIdAndDelete(req.params.id)
  res.json({"Success" : "Note has been deleted", note : note});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }});

module.exports = router;
