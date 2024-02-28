const express = require('express');
const bodyParer = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const HLD = require('./models/HL_Documents');
const DLC = require('./models/DL_Documents');
const requestColl = require('./models/requestToDoctor');
const chatcoll = require('./models/chat_Documents');

try{
    mongoose.connect("mongodb://localhost:27017/hd_db");
}catch(err){
    console.log("error : "+err);
}

let hostHospital = "";
let hostDoctor = "";

async function add(){
    const hosp1 = new HLD();
    hosp1.name = "krishna";
    hosp1.email = "krihna@gmail.com";
    hosp1.password = "krishna";
    try{
        await hosp1.save();
    }catch(err){
        console.log(err);
    }
};

const app = express();
app.use(express.json());
app.use(cors());


app.get('/',async (req,res)=>{
    try{
        res.send("hello");
    }catch(err){
        console.log(err);
        res.redirect('/');
    }
});

app.post('/loginhospital',async(req,res)=>{
    try{
        let email = req.body.email;
        let password = req.body.password;
        let result  = await HLD.findOne({email:email});
        if(result == null){
            res.send({status:"user not found"});
        }
        else if(result.password === password){
            hostHospital = email;
            res.send({status:"ok"});
        }else{
            res.send({status:"password Incorrect"});
        }
        console.log(result);
    }catch(err){
        console.log(err);
    }
});

app.post('/registerHospital',async (req,res)=>{
    try{
        console.log("request arrived");
        const user = new HLD(req.body);
        let result = await user.save();
        console.log(result);
    } catch (e) {
        console.log(e);
        res.send("Something Went Wrong");
    }
});

app.post('/registerDoctor',async (req,res)=>{
    try{
        console.log("request arrived");
        const user = new DLC(req.body);
        let result = await user.save();
        console.log(result);
    } catch (e) {
        console.log(e);
        res.send("Something Went Wrong");
    }
});

app.post('/findHospital',async(req,res)=>{
    try{
        console.log("request arrived frind");
        const user = req.body.name;
        // let result = await HLD.find({name:user})
        let result = await HLD.find()
        console.log(result);
        res.send({status:"ok",data:result})
    }catch(err){
        console.log(err)
    }
});

app.post('/findDoctor',async(req,res)=>{
    try{
        console.log("request arrived find doctor");
        let result = await DLC.find()
        console.log(result);
        res.send({status:"ok",data:result,hostDoctor:hostDoctor});
    }catch(err){
        console.log(err)
    }
});


app.post('/loginDoctor',async(req,res)=>{
    try{
        let email = req.body.email;
        let password = req.body.password;
        let result  = await DLC.findOne({email:email});
        if(result == null){
            res.send({status:"user not found"});
        }
        else if(result.password === password){
            hostDoctor = email;
            res.send({status:"ok"});
        }else{
            res.send({status:"password Incorrect"});
        }
        console.log(result);
    }catch(err){
        console.log(err);
    }
});

app.post('/sendRequest',async(req,res)=>{
    try{
        console.log("request arrived requestdoctor");
        let receiver = req.body.reqDoctorEmail;
        console.log(receiver);
        let expireDate = req.body.expireDate;
        let location = req.body.Location;
        let request = new requestColl();
        request.sender = hostHospital;
        request.receiver = receiver;
        request.expireDate = expireDate;
        request.location = location;
        request.dateOfAppeal = new Date();
        request.salary =req.body.salary;
        let response = await request.save();
        console.log(response);
        res.send({status:"ok",data:response});
    }catch(err){
        console.log(err)
    }
});


app.post('/getNotifications',async(req,res)=>{
    try{
        console.log("request arraived getnotify")
        let response =  await requestColl.find({receiver:hostDoctor});
        console.log(response);
        res.send({status:"ok",data:response});
    }catch(err){
        console.log(err);
    }
});

app.post('/acceptRequest',async(req,res)=>{
    let request = await requestColl.findById({_id:req.body.id});
    request.status = "Accepted";
    request = await request.save();
    res.send({status:"ok",data:request});
});

app.post('/rejectRequest',async(req,res)=>{
    let request = await requestColl.findById({_id:req.body.id});
    request.status = "Rejected";
    request = await request.save();
    res.send({status:"ok",data:request});
});

app.post('/fetchReqest',async(req,res)=>{
    let result = await requestColl.find({sender:hostHospital});
    res.send({status:"ok",data:result});
});


app.post('/sendmsg',async(req,res)=>{
    let receiver = req.body.receiver;
    let msgtext = req.body.msg;
    let result = await chatcoll.updateOne(
        { $or: [
            {receiver:receiver,sender:hostDoctor},
            {receiver:hostDoctor,sender:receiver}
           ]
        },
        {$set:{
            receiver:receiver,
            sender:hostDoctor
        },
            $push:{
            msgContainer:{
                msg:msgtext,
                sender:hostDoctor
            }
            }
        },
        {upsert:true}
    );
    console.log(result);
    res.send({status:"ok",data:result});
});

app.listen(5000,(req,res)=>{
    console.log(`server live on port 5000`);
});

