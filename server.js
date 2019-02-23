const express = require('express');
var nodemailer = require('nodemailer');
var generator=require('generate-password');
const hbs = require('hbs');
const MongoClient = require('mongodb').MongoClient;
var cookieParser = require('cookie-parser');




const port =3000;
var app = express();
app.use(express.static(__dirname + '/views') );
app.use(cookieParser());
app.set('view engine', hbs);

app.get('/', (req,res) => {
    res.render('index.hbs');
});
app.get('/login', (req,res) => {
    res.render('login.hbs');
});
app.get('/signup', (req,res) => {
    res.render('signup.hbs');
});
app.get('/shop', (req,res) => {
    res.render('shop.hbs');
});    


var url ='mongodb://localhost:27017/details'; 
    MongoClient.connect(url,{ useNewUrlParser: true }, (erro,client) => {
        if (erro){
            return console.log('Unable to connect', erro);
        };

     


        console.log('Database Connected sucessfully');
        

var password="";


app.get('/find', (req,res) => {

    var dbo = client.db("mydb");
    dbo.collection("ads").find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      res.send(result);




  
      });
      client.close();

});


app.get('/form',(req,res)=>{

    res.render('otp.hbs');

    password=generator.generate({

        length:8,
        numbers:true
    });






var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: 'devsoc.1997@gmail.com',			//email ID
               pass: "BROGRAMMERS"				//Password 
           }
       });
       var mailOptions = {
        from: 'devsoc.2019@gmail.com',
        to: req.query.email,
        subject: 'ReCycle OTP',
        text: "Hello"+req.query.name + 
        "Your OTP is"+password
      };
      
      let users={

        name:req.query.name,
        email:req.query.email,
        phone:req.query.phone,
        pass:req.query.pass
      }
     console.log(users);


      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });


      res.cookie("userData", users); 
});

app.get("/main", (req, res)=>{
    res.render('fetch.hbs');
})

app.get("/postad", (req,res) => {
    
    console.log(req.query);
    const dbo = client.db('mydb');
    dbo.collection('ads').insertOne({

        'model':req.query.model,
         'company':req.query.company,
          'phno':req.query.phno,
          'price':req.query.price
    },(error,result)=>
    {
        if(error)
        {
            res.send(error);
        }
        else{
            res.send("Success");
        }
           
        })
         client.close();

})







app.get('/authen', (req,res) => 
{
  console.log("INSIDE AUTHEN"); 
  var dbo = client.db("details");
  var query = { Email:req.query.username };
  dbo.collection("users").find(query).toArray(function(err, result) {
    var data=result;
    console.log(data);
    if (err) throw err;
    else if(data===[]){
        res.render("No account exits");
}
    
   else if(data[0]["Password"]===req.query.psw)
   {
       res.render("");
   }
   else
   {
       res.send("Wrong Password");
   }

    

});
client.close();
});


app.get("/acknowledge",  (req, res) => {


    
      var recvd=req.query.otp;

      var data=req.cookies;
      console.log(data);
      console.log(recvd);
      console.log(password);
      if(recvd===password)
      {
        const db = client.db('details');
    db.collection('users').insertOne({

        'Name':data["userData"]["name"],
         'Email':data["userData"]["email"],
          'Password':data["userData"]["pass"]
    },(error,result)=>
    {
        if(error)
        {
            res.send("Error");
        }
        else{
            res.render('succ.hbs');
        }
           
        })
         client.close();
    }
    else{

        res.send("Invalid Otp");
    }
    });


});
app.listen(port, () => {
    console.log('Server is up at port ' + port);
});