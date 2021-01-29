var DEFAULTCONTRCT='SupplyChain1';
var DEFAULTCONTRACTADDRESS='0x2fc2d00121fa4210948fbefa913e4de5a8c54797';

var express=require('express');
var app =express();
var bodyParser = require('body-parser'); 

var cli = require('./cli') 

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

const path = require('path');
const utils = require('../api/common/utils');
const fs = require('fs');
const { Web3jService, ConsensusService, SystemConfigService } = require('../api'); 
const { ContractsDir, ContractsOutputDir } = require('./constant');

const web3 = new Web3jService();
const consensusService = new ConsensusService();
const systemConfigService = new SystemConfigService();

const { check, string, boolean } = require('../api/common/typeCheck');
const channelPromise = require('../api/common/channelPromise');
const web3Sync = require('../api/common/web3lib/web3sync');
const isArray = require('isarray');
const ServiceBase = require('../api/common/serviceBase').ServiceBase;
const { produceSubCommandInfo, FLAGS, getAbi } = require('./interfaces/base');

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
 });

 app.post('/deploy',function(req, res){
    let data = req.body
    let temp = {}
    for(let item in data){
        temp = item
    }
    temp = JSON.parse(temp)
    console.info('temp',temp.contractName)

    let name = temp.contractName
    
    let contractName = name;

        if (!contractName.endsWith('.sol')) {
            contractName += '.sol';
        }
       
        let contractPath = path.join(ContractsDir, contractName);
        if (!fs.existsSync(contractPath)) {
            throw new Error(`${contractName} doesn't exist`);
        }
        let outputDir = ContractsOutputDir;

        web3.deploy(contractPath, outputDir).then(result => {
            let contractAddress = result.contractAddress;
            if (result.status === '0x0') {
                let addressPath = path.join(outputDir, `.${path.basename(contractName, '.sol')}.address`);

                try {
                    fs.appendFileSync(addressPath, contractAddress + '\n');
                } catch (error) { }
            }
            res.send({ contractAddress: contractAddress, status: result.status })
        });
})

app.post('/AddContract',function(req,res) {
    let data = req.body
    let temp = {}
    for(let item in data){
        temp = item
    }
    temp = JSON.parse(temp)
    console.info('temp',temp)

    let content = temp
    let contractName = DEFAULTCONTRCT; 
    let contractAddress = DEFAULTCONTRACTADDRESS;
    let functionName = content.func;
    let parameters = [];

        parameters.push(content.fromAccount)
        parameters.push(content.toAccount)
        parameters.push(content.prover)
        parameters.push(parseInt(content.amount))

    let abi = getAbi(contractName);
    
    if (!abi) {
        throw new Error(`no abi file for contract ${contractName}`);
    }

    for (let item of abi) {
        if (item.name === functionName && item.type === 'function') {
            if (item.inputs.length !== parameters.length) {
                throw new Error(`wrong number of parameters for function \`${item.name}\`, expected ${item.inputs.length} but got ${parameters.length}`);
            }

            functionName = utils.spliceFunctionSignature(item);

            if (item.constant) {
                return web3.call(contractAddress, functionName, parameters).then(result => {
                    let status = result.result.status;
                    let ret = {
                        status: status
                    };
                    let output = result.result.output;
                    if (output !== '0x') {
                        ret.output = utils.decodeMethod(item, output);
                    }
                    res.send(ret)
                });
            } else {
                return web3.sendRawTransaction(contractAddress, functionName, parameters).then(result => {
                    let txHash = result.transactionHash;
                    let status = result.status;
                    let ret = {
                        transactionHash: txHash,
                        status: status
                    };
                    let output = result.output;
                    if (output !== '0x') {
                        ret.output = utils.decodeMethod(item, output);
                    }
                    res.send(ret)
                });
            }
        }
    }
})

app.post('/Transfer',function(req,res) {
    let data = req.body
    let temp = {}
    for(let item in data){
        temp = item
    }
    temp = JSON.parse(temp)
    console.info('temp',temp)

    let content = temp
    let contractName = DEFAULTCONTRCT; 
    let contractAddress = DEFAULTCONTRACTADDRESS;
    let functionName = content.func;
    let parameters = [];
        parameters.push(content.fromAccount)
        parameters.push(content.toAccount)
        parameters.push(parseInt(content.amount))
        parameters.push(parseInt(content.receiptID)) 
    let abi = getAbi(contractName);
    
    if (!abi) {
        throw new Error(`no abi file for contract ${contractName}`);
    }

    for (let item of abi) {
        if (item.name === functionName && item.type === 'function') {
            if (item.inputs.length !== parameters.length) {
                throw new Error(`wrong number of parameters for function \`${item.name}\`, expected ${item.inputs.length} but got ${parameters.length}`);
            }

            functionName = utils.spliceFunctionSignature(item);

            if (item.constant) {
                return web3.call(contractAddress, functionName, parameters).then(result => {
                    let status = result.result.status;
                    let ret = {
                        status: status
                    };
                    let output = result.result.output;
                    if (output !== '0x') {
                        ret.output = utils.decodeMethod(item, output);
                    }
                    res.send(ret)
                });
            } else {
                return web3.sendRawTransaction(contractAddress, functionName, parameters).then(result => {
                    let txHash = result.transactionHash;
                    let status = result.status;
                    let ret = {
                        transactionHash: txHash,
                        status: status
                    };
                    let output = result.output;
                    if (output !== '0x') {
                        ret.output = utils.decodeMethod(item, output);
                    }
                    res.send(ret)
                });
            }
        }
    }
})

app.post('/Financing',function(req,res) {
    let data = req.body
    let temp = {}
    for(let item in data){
        temp = item
    }
    temp = JSON.parse(temp)
    console.info('temp',temp)

    let content = temp
    let contractName = DEFAULTCONTRCT;
    let contractAddress = DEFAULTCONTRACTADDRESS;
    let functionName = content.func;
    let parameters = [];
        parameters.push(parseInt(content.receiptID)) 
    
    let abi = getAbi(contractName);
    
    if (!abi) {
        throw new Error(`no abi file for contract ${contractName}`);
    }

    for (let item of abi) {
        if (item.name === functionName && item.type === 'function') {
            if (item.inputs.length !== parameters.length) {
                throw new Error(`wrong number of parameters for function \`${item.name}\`, expected ${item.inputs.length} but got ${parameters.length}`);
            }

            functionName = utils.spliceFunctionSignature(item);

            if (item.constant) {
                return web3.call(contractAddress, functionName, parameters).then(result => {
                    let status = result.result.status;
                    let ret = {
                        status: status
                    };
                    let output = result.result.output;
                    if (output !== '0x') {
                        ret.output = utils.decodeMethod(item, output);
                    }
                    res.send(ret)
                });
            } else {
                return web3.sendRawTransaction(contractAddress, functionName, parameters).then(result => {
                    let txHash = result.transactionHash;
                    let status = result.status;
                    let ret = {
                        transactionHash: txHash,
                        status: status
                    };
                    let output = result.output;
                    if (output !== '0x') {
                        ret.output = utils.decodeMethod(item, output);
                    }
                    res.send(ret)
                });
            }
        }
    }
})

app.post('/Settle',function(req,res) {
    let data = req.body
    let temp = {}
    for(let item in data){
        temp = item
    }
    temp = JSON.parse(temp)
    console.info('temp',temp)

    let content = temp
    let contractName = DEFAULTCONTRCT; 
    let contractAddress = DEFAULTCONTRACTADDRESS;
    let functionName = content.func;
    let parameters = [];
        parameters.push(parseInt(content.receiptID)) 
    let abi = getAbi(contractName);
    
    if (!abi) {
        throw new Error(`no abi file for contract ${contractName}`);
    }

    for (let item of abi) {
        if (item.name === functionName && item.type === 'function') {
            if (item.inputs.length !== parameters.length) {
                throw new Error(`wrong number of parameters for function \`${item.name}\`, expected ${item.inputs.length} but got ${parameters.length}`);
            }

            functionName = utils.spliceFunctionSignature(item);

            if (item.constant) {
                return web3.call(contractAddress, functionName, parameters).then(result => {
                    let status = result.result.status;
                    let ret = {
                        status: status
                    };
                    let output = result.result.output;
                    if (output !== '0x') {
                        ret.output = utils.decodeMethod(item, output);
                    }
                    res.send(ret)
                });
            } else {
                return web3.sendRawTransaction(contractAddress, functionName, parameters).then(result => {
                    let txHash = result.transactionHash;
                    let status = result.status;
                    let ret = {
                        transactionHash: txHash,
                        status: status
                    };
                    let output = result.output;
                    if (output !== '0x') {
                        ret.output = utils.decodeMethod(item, output);
                    }
                    res.send(ret)
                });
            }
        }
    }
})

app.post('/Prove',function(req,res) {
    let data = req.body
    let temp = {}
    for(let item in data){
        temp = item
    }
    temp = JSON.parse(temp)
    console.info('temp',temp)

    let content = temp
    let contractName = DEFAULTCONTRCT;  
    let contractAddress = DEFAULTCONTRACTADDRESS;
    let functionName = content.func;
    let parameters = [];
        parameters.push(parseInt(content.receiptID)) 
    let abi = getAbi(contractName);
    
    if (!abi) {
        throw new Error(`no abi file for contract ${contractName}`);
    }

    for (let item of abi) {
        if (item.name === functionName && item.type === 'function') {
            if (item.inputs.length !== parameters.length) {
                throw new Error(`wrong number of parameters for function \`${item.name}\`, expected ${item.inputs.length} but got ${parameters.length}`);
            }

            functionName = utils.spliceFunctionSignature(item);

            if (item.constant) {
                return web3.call(contractAddress, functionName, parameters).then(result => {
                    let status = result.result.status;
                    let ret = {
                        status: status
                    };
                    let output = result.result.output;
                    if (output !== '0x') {
                        ret.output = utils.decodeMethod(item, output);
                    }
                    res.send(ret)
                });
            } else {
                return web3.sendRawTransaction(contractAddress, functionName, parameters).then(result => {
                    let txHash = result.transactionHash;
                    let status = result.status;
                    let ret = {
                        transactionHash: txHash,
                        status: status
                    };
                    let output = result.output;
                    if (output !== '0x') {
                        ret.output = utils.decodeMethod(item, output);
                    }
                    res.send(ret)
                });
            }
        }
    }
})

var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.info('listen 8080')
})
