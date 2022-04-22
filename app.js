const express = require('express');
const bodyParser = require('body-parser');
const Speakeasy = require('speakeasy');
const { time } = require('speakeasy');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


app.post('/totp-secret', (req, res, next)=> {
    var secret = Speakeasy.generateSecret({length: 20});
    // console.log("===========>> secret", secret);
    res.send({"secret": secret.base32});
});

app.post('/totp-generate', (req, res, next)=> {

    var token = Speakeasy.totp({
        secret: req.body.secret,
        encoding: 'base32',
      });

    res.send({
        "token": token,
        "remaining": (30 - Math.floor(new Date().getTime() / 1000.0 % 30)),
    })

});

app.post("/totp-validate", (req, res, next) => {

    let isValid = Speakeasy.totp.verify({
        secret: req.body.secret,
        encoding: "base32",
        token: req.body.token
    });
    res.send({
        "isValide": isValid
    });
    // console.log("tokenValidates =====>", tokenValidates);
    // res.send({
    //     "valid": Speakeasy.hotp.verify({
    //         secret: req.body.secret,
    //         encoding: 'base32',
    //         token: req.body.token,
    //         window: 0
    //         // counter: 123
    //     })
    // });
});

// app.post("/totp-secret", (request, response, next) => {
//     var secret = Speakeasy.generateSecret({ length: 20 });
//     response.send({ "secret": secret.base32 });
// });

// app.post("/totp-generate", (request, response, next) => {
//     response.send({
//         "token": Speakeasy.totp({
//             secret: request.body.secret,
//             encoding: "base32"
//         }),
//         "remaining": (30 - Math.floor((new Date()).getTime() / 1000.0 % 30))
//     });
// });

// app.post("/totp-validate", (request, response, next) => {
//     let isValide = Speakeasy.totp.verify({
//         secret: request.body.secret,
//         encoding: "base32",
//         token: request.body.token,
//         window: 0
//     });
//     response.send({
//         "valid": isValide
//     });
// });

app.listen(3000, ()=>{
    console.log('App listening port:3000');
});