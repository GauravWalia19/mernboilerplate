const fs = require('fs').promises;
const inquirer = require('inquirer');
const axios = require('axios');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const questions = [
    {
        type: 'input',
        name: 'projectAuthor',
        message: 'Enter the Project Author',
        default: 'Gaurav Walia'
    },
    {
        type: 'input',
        name: 'projectName',
        message: 'Enter name of the project',
        default: 'mernboilerplate',
    },
    {
        type: 'input',
        name: 'projectDescription',
        message: 'Enter the Description of the project',
        default: "A minimalist MERN app boilerplate that does'nt suck",
    },
    {
        type: 'input',
        name: 'projectVersion',
        message: 'Enter the version of the project',
        default: '1.0.0',
    },
    {
        type: 'list',
        name: 'projectLicense',
        message: 'Choose the license',
        choices: [
            'Apache License 2.0',
            'GNU General Public License v3.0',
            'MIT License',
            'The Unlicense',
        ],
    },
    {
        type: 'list',
        name: 'projectTemplate',
        message: 'Setup the template you need',
        choices: [
            'Normal Deployment - Local Development and Production Deployment',
            'Normal Deployment - Branching, CI & CD',
            'Using Containerisation with Docker - Docker Compose in Development and Production Deployment',
        ],
    },
    {
        type: 'confirm',
        name: 'installDps',
        message: 'Install Dependencies (client+server)?',
        default: false
    },
    {
        type: 'confirm',
        name: 'confirm',
        message: 'Are u Sure?',
        default: true,
    },
];

// read the JSON from package.json files
async function readPackageFile(filePath) {
    return JSON.parse(await fs.readFile(filePath, 'UTF-8'));
}

// create the file with the content
async function createFile(filePathName, fileContent){
    await fs.writeFile(filePathName, fileContent,'UTF-8')
    .catch((err)=>console.log(err))
}

async function fileExists(filePathName){
    try{
        await fs.access(filePathName);
        return true;
    }catch{
        return false;
    }
}

// use this method carefully as it will delete the file
async function deleteFile(filePathName){
    if(await fileExists(filePathName)){
        await fs.unlink(filePathName);
    }
}

// setup the necessary files
async function setupProject(answers){
    const projectTemplate = answers.projectTemplate;
    const serverPackageJson = await readPackageFile('./package.json').catch((err) => {
        console.log(err);
    });
    const clientPackageJson = await readPackageFile('./client/package.json').catch((err)=>{
        console.log(err);
    })

    // setup normal files
    serverPackageJson.author        = answers.projectAuthor;
    serverPackageJson.name          = answers.projectName;
    serverPackageJson.description   = answers.projectDescription;
    serverPackageJson.version       = answers.projectVersion;
    switch(answers.projectLicense){
        case "Apache License 2.0":
            serverPackageJson.license = "Apache-2.0";
            break;
        case "GNU General Public License v3.0":
            serverPackageJson.license = "GPL-3.0";
            break;
        case "MIT License":
            serverPackageJson.license = "MIT";
            break;
        case "The Unlicense":
            serverPackageJson.license = "Unlicense";
            break;
    }
    clientPackageJson.author    = answers.projectAuthor;
    clientPackageJson.version   = answers.projectVersion;

    // creating new LICENSE file
    const licenseResponse = await axios.get(`https://api.github.com/licenses/${serverPackageJson.license}`,{
        headers:{
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .catch((err)=>console.log(err))
    if(licenseResponse.hasOwnProperty('data') && licenseResponse.data.hasOwnProperty('body')){
        let content = licenseResponse.data.body;
        // replace default values
        content = content.replace("[yyyy]",             new Date().getFullYear());
        content = content.replace("[year]",             new Date().getFullYear());
        content = content.replace("[fullname]",         serverPackageJson.author);
        content = content.replace(/<year>/g,            new Date().getFullYear());
        content = content.replace(/<name of author>/g,  serverPackageJson.author);
        content = content.replace("[name of copyright owner]", serverPackageJson.author);
        content = content.replace("<program>",          serverPackageJson.name);
        createFile('LICENSE', content);
    }

    // setup template files
    console.log('Adding Template files...');
    switch(projectTemplate){
        case "Normal Deployment - Local Development and Production Deployment":
            await setupLocalDevelopmentProductionDeployment(serverPackageJson, clientPackageJson);
            break;
    }

    // write updated package json files
    console.log('Updating package.json files...');
    // createFile("package.json", JSON.stringify(serverPackageJson,null,"\t"));
    // createFile("client/package.json", JSON.stringify(clientPackageJson,null,"\t"));

    // install dependencies
    if(answers.installDps){
        console.log("Installing Dependencies...");
        const command1 = await exec("yarn install").catch(err => console.log(err))
        console.log(command1.stdout);
        const command2 = await exec("cd client && yarn install").catch(err => console.log(err))
        console.log(command2.stdout);
    }

    console.log(`The project is now ready with the template: ${projectTemplate}`);
    console.log("Thank You! for using mernboilerplate setup");
}

/**
 * @description function to setup the template 
 * Normal Deployment - Local Development and Production Deployment
 * @param serverPackageJson
 * @param clientPackageJson
 **/
async function setupLocalDevelopmentProductionDeployment(serverPackageJson, clientPackageJson){
    // server
    createFile("ProcFile", "web: yarn run start");
    serverPackageJson.scripts["dev:server"]         = "nodemon server.js";
    serverPackageJson.scripts["dev:client"]         = "cd client && yarn start";
    serverPackageJson.scripts["dev:mern"]           = "concurrently -n 'server,client' -c 'yellow,blue' \"yarn run dev:server\" \"yarn run dev:client\"";
    serverPackageJson.scripts["heroku-postbuild"]   = "cd client && yarn install && yarn run build";
    // createFile(".env","MONGODB_URI=<MONGODB>");

    // client
    if(!clientPackageJson.hasOwnProperty("proxy")){
        clientPackageJson.proxy = "http://localhost:5000"
    }

    // cleanup files
    deleteFile('heroku.yml');
} 

async function main() {
    console.log('Welcome to mernboilerplate setup!!!\n');
    
    const answers = await inquirer.prompt(questions)
    .catch((error) => {
        console.log(
            error.isTtyError
                ? "Prompt couldn't be rendered in the current environment"
                : error
        );
    });

    // stops the setup if user don't want to setup
    if (!answers.confirm) {
        return;
    }

    await setupProject(answers);
}

main();
