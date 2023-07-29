import express from "express";
import request from "request";
import https from "https";
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get("/", function(req , res)
{
    res.sendFile(__dirname+ "/signup.html")
});

app.post("/", function(req , res)
{
    const firstName = req.body.firstName ;
    const lastName = req.body.lastName ;
    const email = req.body.email ;
    // const password = req.body.password ;

    const data = {
        members : [{
            email_address: email ,
            status: "subscribed",
            merge_fields : {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/7b04d9c10e";

    const options = {
        method: "POST",
        auth: "abhay:88d75eb4a016eabd686d32af116d124e-us21"
    }

    const request= https.request(url , options , function(response)
    {   
        if(response.statusCode === 200)
        {
            res.sendFile(__dirname+"/success.html");
        }
        else
        {
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req , res)
{
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server 3000");
})

// Api Key :- 88d75eb4a016eabd686d32af116d124e-us21
// ID:   7b04d9c10e