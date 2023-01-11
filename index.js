//Use PostMan to see the ouput

const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Post = require("./models/userDet");
const cors = require("cors")
const app = express();
const userD = require("./models/userEmr");
const multer = require('multer');
//const child_process = require('child_process');
const qr  = require('qrcode');
const db = mongoose.connect("mongodb+srv://random1:randompass@cluster0.fpgiszd.mongodb.net/LifeLine?retryWrites=true&w=majority");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './my-uploads');
    },
});
const uploads = multer({ storage: storage });
const fs1 = require('fs');
//const outputDirectory = 'converted_files';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(function (err, req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log(err);
    next();
});
app.use(express.static('./my-uploads'));

app.post('/newpost', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const sec = req.body.mobile;
    //console.log(req.body);
    var post = new Post();
    post.name = name;
    post.email = email;
    post.password = password;
    post.mobileno = sec;
    qr.toDataURL(sec,(err,qc)=>{
        if(err){
            console.log(err);
        }
        post.qrc = qc;
        //console.log(post.qrc);
        post.save((err, saved) => {
            if (err) {
                console.log(err);
                res.status(500).send({ err: "Error" });
            } else {
                res.status(200).send(saved);
            }
        })
    })
    //console.log(post);
});


app.post('/addpost', uploads.any(), (req, res, next) => {
    console.log(req.body);
    //console.log(req.files);
    const userId = req.body.userID;
    const bt = req.body.bloodType;
    const n = req.body.name;
    const pn = req.body.phoneNo;
    //const fs = req.files;
    const data1 = new userD();
    data1.userID = userId;
    data1.bloodType = bt;
    data1.nameFile = n;

    for (let i = 0; i < req.files.length; i++) {
        const fileBuffer = fs1.readFileSync(req.files[i].path);
        data1.files.push({name:req.files[i].originalname,file:fileBuffer});
    }
    for(let i=0;i<pn.length;i++){
        data1.phoneNo.push(pn[i]);
    }
    data1.save((err, saved) => {
        if (err) {
            console.log(err);
            res.status(500).send({ err: "Error" });
        } else {
            res.status(200).send(saved);
        }
    })
    //console.log(data1);
});


app.post("/valpost", (req, res) => {
    console.log(req.body);
    //const title = req.body.title;
    Post.findOne({ mobileno: req.body.mobile }, (err, posts1) => {
        if (err) {
            res.status(404).send({ error: "Email not found!!" });
            // throw err;
        } else {
            if (posts1.password === req.body.password) {
                res.status(200).send();
            }
            else {
                res.status(404).send("Email or Password is wrong");
                // throw err;
            }
        }
    })
})

app.get('/:id', (req, res) => {
    const req1 = req.params.id;
    userD.findOne({ userID: req1 }, (err, post2) => {
        if (err) {
            //console.log("error");
            res.status(404).send({ Error: "Invalid userID received" });
        } else {
            //console.log(post2.files);
        //     let filesL = post2.files.length;
        //     // console.log(files);
        //     for (let i = 0; i < filesL; i++) {
        //         const tempFilePath = `file${i}`;
        //         fs1.writeFileSync(tempFilePath,post2.files[i].file,{flag:'w'});
      
        //         // Use the child_process module to run the unoconv command
        //         const command = "C:\\Program Files\\LibreOffice\\program\\soffice.exe";
        //         console.log(command);
        //         child_process.execFile(command,['--headless',
        //         '--convert-to', 'pdf',
        //         '--outdir', 'output',
        //         tempFilePath], (error, stdout, stderr) => {
        //             if (error) {
        //                 // Handle the error
        //                 console.error(error);
        //                 //res.status(500).send();
        //                 return;
        //             }
        //             console.log("here");
        //             // Send the converted file back to the client
        //             //res.sendFile(`/output/${tempFilePath}.pdf`);
        //         }
        //     //res.status(200).send(post2);
        // )
        //     }
            res.send(post2);
        }
    }
)}
)

app.post('/editpost',uploads.any(),(req,res)=>{
    console.log(req.body);
    console.log(req.files);
    const userId = req.body.userID;
    const bt = req.body.bloodType;
    const n = req.body.name;
    const data1 = new userD({
        userID:userId,
        bloodType:bt,
        nameFile:n,
        phoneNo:req.body.phoneNo,
        files:[]
    });
    for (let i = 0; i < req.files.length; i++) {
        const fileBuffer = fs1.readFileSync(req.files[i].path);
        data1.files.push({name:req.files[i].originalname,file:fileBuffer});
    }
    userD.findOneAndDelete({userID:userId},(err)=>{
        if(err){
            console.log(err);
            res.status(500).send();
        }
        else{
            data1.save((err, saved) => {
                if (err) {
                    res.status(500).send({ err: "Error" });
                } else {
                    res.status(200).send(saved);
                }
            })
        }
    })
    
})

console.log('3001');
app.listen(process.env.PORT || 3001);