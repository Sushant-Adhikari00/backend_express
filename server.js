const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const { connectDB } = require("./config/db");
const dotenv = require("dotenv").config();

connectDB();

const app =express();

const port = process.env.PORT || 5000;
app.use(express.json());
app.use("/api/notes", require("./routes/notesRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use(errorHandler);

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);

})