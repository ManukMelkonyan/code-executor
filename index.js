// const child_process = require('child_process');
const express = require('express');
const app = express();

const exec = require('child_process').exec;



const sourceCode = `
    '5';
    console.log(typeof('5'));
    let x = 10;
    console.log(x + '220');
    console.log("what the hell is going on");
`;


app.use(express.json());

app.post('/submit', (req, res) => {
    const upContainerAndRunCode = (code) => {
        exec(`docker run -e SOURCE_CODE="$SOURCE_CODE" js-runtime:latest`, {env: {"SOURCE_CODE": code}},  (err, stdout, stderr) => {
            if(err) {
                console.error(err);
                res.send(stderr);
            }
            else {
                console.log(stdout);
                res.send(stdout);
            }   
        });
    }
    upContainerAndRunCode(req.body.code);
})


app.listen(5000, () => {
    console.log("listening to 5000");
})