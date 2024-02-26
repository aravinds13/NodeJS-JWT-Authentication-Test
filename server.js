const express = require('express');
const exjwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const port = 3000;
const secretKey = 'My secret key';

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');
    next();
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const jwtMW = exjwt({
    secret: secretKey,
    algorithms: ['HS256']
});


let users = [
    {
        id: 1,
        username: 'hello',
        password: 'world'
    },
    {
        id: 2,
        username: 'hey',
        password: 'there'
    }
];

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname,'index.html'));
})

app.get('/dashboard', (_, res) => {
    res.sendFile(path.join(__dirname,'index.html'));
})

app.get('/settings', (_, res) => {
    res.sendFile(path.join(__dirname,'index.html'));
})

app.get('/api/dashboard', jwtMW, (req,res) =>{
    res.json({
        success: true,
        myContent: 'Shush! Only logged in people should see this.'
    })
})

app.get('/api/settings', jwtMW, (req,res) =>{
    res.json({
        success: true,
        myContent: 'This is the settings'
    })
})

app.post('/api/login', (req, res) => {
    const {username, password} = req.body;
    
    for(let user of users) {
        if(username == user.username && password == user.password){
            let token = jwt.sign({id: user.id, username: user.username}, secretKey, {expiresIn: '3m'});
            res.json({
                success: true,
                err: null,
                token
            });
            break;
        }
        else {
            res.status(401).json({
                success: false,
                token: null,
                err: 'Username or password is incorrect'
            })
        }
    }
})

app.use((err, req, res, next) => {
    if(err.name === 'UnauthorizedError'){
        res.status(401).json({
            success: false,
            officialError: err,
            err: 'Username or password is incorrect 2'
        });
    }
    else{
        next(err);
    }
}) 

app.listen(port, ()=> {
    console.log(`App listening to port ${port}`);
})
