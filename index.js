const TodoTask = require("./models/TodoTask");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
let PORT = 3000;
const mongoose = require("mongoose");
require('dotenv').config()

// dotenv.config();
app.listen(PORT, () => console.log(`Server up and running on ${PORT}.`))
app.use("/static", express.static("public"))
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

//connection to db
// mongoose.set("useFindAndModify", false);
// mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log("Connected to db!");
})

//Get Method
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
      res.render("index.ejs", { todoTasks: tasks });
    });
  });

//POST METHOD
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try 
    {
        await todoTask.save();
        res.redirect("/");
    } 
    catch (err) 
    {
        res.redirect("/");
    }
});

//DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, (err) => {
      if (err) return res.send(500, err);
      res.redirect("/");
    });
  });

  //UPDATE
  app
    .route("/edit/:id")
    .get((req, res) => {
      const id = req.params.id;
      TodoTask.find({}, (err, tasks) => {
        res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
      });
    })
    .post((req, res) => {
      const id = req.params.id;
      TodoTask.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
        if (err) return res.send(500, err);
        res.redirect("/");
      });
    });

