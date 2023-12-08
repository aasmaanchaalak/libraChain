/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

let msgID;
let userID;
let arg1, arg2, arg3;
process.argv.forEach(function (val, index, array) {
    msgID = array[2];
    userID = array[3];
    arg1 = array[4];
    arg2 = array[5];
    arg3 = array[6];
});

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        //console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(userID);
        if (!identity) {
            console.log(`An identity for the user ${userID} does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: userID, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabchat');

        // Evaluate the specified transaction.
        // queryMsg transaction - requires 1 argument, ex: ('queryMsg', 'MSG0')
        // queryAllMsgs transaction - requires no arguments, ex: ('queryAllMsgs')
        if (msgID === '-1') {
            const result = await contract.evaluateTransaction('queryAllMsgs');
            console.log(`TransactionTypeAll has been evaluated, result is: ${result.toString()}`);
        } else if (msgID == 'findBook'){
            if (!arg3){
                arg3 = "";
            }
            if (!arg2){
                arg2="";
            }
            const result = await contract.evaluateTransaction(msgID, arg1, arg2, arg3);
            console.log(`TransactionTypeID has been evaluated, result is: ${result.toString()}`);
            
        } else if (arg1){
            const result = await contract.evaluateTransaction(msgID, arg1);
            console.log(result);
        } 
        else {
            const result = await contract.evaluateTransaction(msgID);
            console.log(result);
        }

        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();
