const express = require('express')
const bodyParser = require('body-parser');

const app = express()

const PORT = process.env.PORT || 3000;
const headers = []


app.use(bodyParser.json())
app.use(express.urlencoded({extended: false}))
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append("Access-Control-Allow-Headers", "Content-Type")
    next();
});


app.post('/headers', (req, res) => {
    try {
        headers.push(req.body.headerArray)
        res.send({"success": true}) 
    } catch(err) {
        res.send({"success": false, "error": err})
    }
})

app.get('/shape', (req, res) => {
    try {
        if(headers.length > 0) {
            res.send({"success": true, "headers": headers[0]})
            headers.shift()   
        } else {
            res.send({"success": true, "headers": null})
        }
    } catch(err) {
        res.send({"success": false, "error": err, "headers": []})
    }
})

app.listen(PORT)
