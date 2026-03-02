// let displayMessage = require('./index2.js');
// displayMessage("Hello, World!");    
// const express = require('express');
// app.use(express.json());
// app.use(express.static('./static'));

// import validator from 'validator';





// const express = require('express');
// const app= express();
// const port=3000;
// // get request / hallo >>>> hallo world)دلوقتي عاوز لو اليوزر بعتلي halloo او hallooo او halloooo يرد عليا ب hallo world)
// app.get('/',(req,res)=>{
//     res.send("hallo world");
// });





// app.listen(port,()=>{
//     console.log(`Server is running on port ${port}`);
// });


// const app = express();
// const port = 3000;
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });
// app.get( "/", (req, res) => {
//     res.send("Hello, World!");
// }); 
const express = require('express');
const app = express();
const port = 3000;  

// Middleware to parse JSON bodies
app.use((req, res, next) => {
  console.log("Middleware executed");
    next();
});
  
app.get('/ hallo', (req, res) => {
    res.send("Hello, World!");
});

//post     / todos >>>> add new todo
app.post('/todos', (req, res) => {
    let newTodo = req.body.todo;
  console.log("New todo added:", newTodo);
});





app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});