const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');


const app=express();
app.use(express.json());//middleware for sending json format
app.use(cors());

// let todos=[];

//connecting mongodb(db= mern-app)
mongoose.connect('mongodb://localhost:27017/mern-app')
.then(()=>{
    console.log("MongoDB connected");
})
.catch((err)=>{
    console.log(err);
})

//creating schema
const todoschema = new mongoose.Schema(
    {
        title:
        {
            required:"true",
            type:String
        },
        desc:String
    }
)

//creating model
const todomodel=mongoose.model('Todo',todoschema);


app.post('/todos',async(req,res)=>{
    const {title,desc}=req.body;
    // const newtodo={
    //     id:todos.length+1,
    //     title,
    //     desc
    // }
    // todos.push(newtodo);
    // console.log(todos);
     

    try {
        const newtodo=new todomodel({title,desc});
        await newtodo.save();
        res.status(201).json(newtodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
})

app.get('/todos',async(req,res)=>
{
    try {
        const todos= await todomodel.find();
        res.json(todos);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
})

//update
app.put('/todos/:id',async(req,res)=>{
    try {
        const {title,desc}=req.body;
    const id=req.params.id;
    const updatedtodo=await todomodel.findByIdAndUpdate(
        id,
        {title,desc},
        {new:true}//to get the newly updated data in postman response
    )
    if(!updatedtodo)
    {
        res.status(404).json({message: "Todo not found"});
    }
    res.json(updatedtodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
    
})

app.delete('/todos/:id' ,async(req,res)=>{
    try {
        const id=req.params.id;
        await todomodel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
    
})
const port= 8000;

app.listen(port,()=>{
    console.log("Server started with the port"+port);
})
