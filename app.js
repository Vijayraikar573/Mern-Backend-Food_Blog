const express=require('express');
const cors=require('cors'); //cors origin resource sharing
const app=express();

const port=4000;

//importing user model
const User=require('./model/users');
const Post=require('./model/posts');

//mongoose

const mongoose=require('mongoose');
mongoose.set('strictQuery',false)

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended:false }))
app.use(cors())


const dbUrl = "mongodb://localhost:27017/foodie";

mongoose.connect(dbUrl,{useNewUrlParser:true}).then(()=>{
    console.log("connecting to db");
})

app.post('/Signin', async (req,res)=>{
    //check if user already existed
    User.findOne({ email:req.body.email }).then((userData)=>{
        if(userData){
            res.send({message:"already exists"})
        }else{
            //add the data to the database
            const user=new User({
                    name: req.body.name,
                    email: req.body.email,
                    pass: req.body.pass
            })

            user.save().then(()=>{
               res.send({message:"user added successful"})
            
         })

        }
    })
})


app.post('/Login', async(req, res) => {
    User.findOne({ email: req.body.email }).then((userData) => {
        if (userData) {
            if (req.body.pass === userData.pass) {
                res.send({ message: 'login successfull',status:200 })
            } else {
                res.send({ message: 'login failed' })
            }
        } else {
            res.send({ message: 'no account seems not match with your credentials' })
        }
    })
})


app.post('/addpost',async(req,res)=>{
           
                const post=new Post({
                    author:req.body.author,
                    title:req.body.title,
                    summary:req.body.summary,
                    image:req.body.image,
                    location:req.body.location
                })
                post.save().then(()=>{
                    res.send({message:"post added successful"}) 
              }).catch((err)=>{
                res.send({message:"post could not be added"})
              })
            
        })


app.get('/food', async (req,res)=>{
    try {
        const posts= await Post.find()
        res.send(posts)
    } catch (error) {
        console.log(error);
    }
})

app.get('/food/:id', async (req,res)=>{
    const {id}=req.params
    try {
        const singleposts= await Post.findById(id)
        res.send(singleposts)
    } catch (error) {
        console.log(error);
    }
})



app.listen(port,()=>{
    console.log("server requested");
})
