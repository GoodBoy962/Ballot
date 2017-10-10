let Web3 = require('web3');
let util = require('ethereumjs-util');
let tx = require('ethereumjs-tx');
let lightwallet = require('eth-lightwallet');
let txutils = lightwallet.txutils;

// Get connection with node
let web3 = new Web3(
  new Web3.providers.HttpProvider('http://localhost:8545')
);

// Address and key variables
let args = process.argv;
let fileName = args[2];
let keys = require(''+args[2]);
let address = keys.address;
let key = keys.key;

// Contract variables
contractRaw = require('./contracts/BallotRaw.json')
const abi = contractRaw.abi;
const contractAddress = contractRaw.address;
const bytecode = contractRaw.bytecode;
const contract = web3.eth.contract(abi);
const contractInstance = contract.at(contractAddress);
const txOptions = {
  nonce: web3.toHex(web3.eth.getTransactionCount(address)),
  gasLimit: web3.toHex(800000),
  gasPrice: web3.toHex(20000000000),
  to: contractAddress
}

function sendRaw(rawTx) {
  let privateKey = new Buffer(key, 'hex');
  let transaction = new tx(rawTx);
  transaction.sign(privateKey);
  let serializedTx = transaction.serialize().toString('hex');
  web3.eth.sendRawTransaction(
    '0x' + serializedTx,
    function(err, res) {
      if (err) {
        console.log("Can't!");
      } else {
        return res;
      }
    });
}

let getProposalsNumber = new Promise((resolve, reject) => {
  contractInstance.getProposalsLength.call((err, res) => {
    if (err) {
      reject(err);
    } else {
      resolve(res.c);
    }
  });
});

function getProposal(index) {
  return new Promise((resolve, reject) => {
    contractInstance.proposals.call(index, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

function getProposals() {
  getProposalsNumber.then((res, err) => {
    let proposalNum = parseInt(res);
    return proposalNum;
  }).then(proposalNum => {
    for (let i = 0; i < proposalNum; i++) {
      getProposal(i).then((res, err) => {
        if (res[0]) {
          console.log('id:', i, 'theme:', res[0], 'for', res[1].c, 'against:', res[2].c, 'active:', res[3]);
        }
      })
    }
  });
}

function createProposal(theme) {
  let rawTx = txutils.functionTx(abi, 'applyProposal', [theme], txOptions);
  sendRaw(rawTx);
}

function vote(proposalId, value) {
  let rawTx = txutils.functionTx(abi, 'vote', [proposalId, value], txOptions);
  sendRaw(rawTx);
}

function finishProposal(proposalId) {
  let rawTx = txutils.functionTx(abi, 'finishProposal', [proposalId], txOptions);
  res = sendRaw(rawTx);
}

function removeProposal(proposalId) {
  let rawTx = txutils.functionTx(abi, 'removeProposal', [proposalId], txOptions);
  sendRaw(rawTx);
}

//Commands processing
let command = '' + args[3];
switch (command) {
  case 'view':
    getProposals();
    break;
  case 'vote':
    proposalId = args[4];
    value = args[5];
    vote(proposalId, value);
    break;
  case 'f':
    proposalId = args[4];
    finishProposal(proposalId);
    break;
  case 'rm':
    proposalId = args[4];
    removeProposal(proposalId);
    break;
  case 'create':
    theme = args[4];
    createProposal(theme);
    break;
  default: console.log('No such a command');

}
