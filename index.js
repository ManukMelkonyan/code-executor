const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');

const exec = require('child_process').exec;

app.use(express.json());

app.post('/submit', (req, res) => {
    const upContainerAndRunCode = (code, language) => {
        const containerName = language + '-' + uuidv4();
        console.log({ containerName });
        let isTimeout = false;
        let responseSent = false;
        exec(`docker run --rm -e SOURCE_CODE="$SOURCE_CODE" --name '${containerName}' ${language}-runtime:latest`, {env: {"SOURCE_CODE": code}},  (err, stdout, stderr) => {
            if(err) {
                if (isTimeout) return;
                console.error("Error", err);

                if (!responseSent) {
                    res.send(stderr);
                    responseSent = true;
                }
            }
            else {
                console.log(stdout);
                if (!responseSent) {
                    res.send(stdout);
                    responseSent = true;
                }
            }
        });
        exec(`sleep 5`, (err, stdout, stderr) => {
            if (responseSent) return;
            if(err) {
                console.error(err);
            }
            else {
                console.log(stdout);
            }
            res.send("Execution time limit exceeded");
            responseSent = true;
            isTimeout = true;
            exec(`docker stop ${containerName}`, (err, stdout, stderr) => {
                if(err) {
                    console.log("error while stopping container\n", err);
                }
                else {
                    console.log('succesfully stopped container');
                }

            })
        });
    }
    upContainerAndRunCode(req.body.code, req.body.language);
})


app.listen(5000, () => {
    console.log("listening to 5000");
})