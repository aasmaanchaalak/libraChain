/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');


// const {FileSystemWallet, Gateway} = require('fabric-network');
// const fs = require('fs');
// const path = require('path');
// const ccpPath = path.resolve(__dirname, '..', '..', 'basic-network', 'connection.json');
// const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
// const ccp = JSON.parse(ccpJSON);
let user, choice, msg, emailID, isAnonymous;

process.argv.forEach(function (val, index, array) {
    choice = array[2];
    msg = array[3];
    user = array[4];
    emailID = array[5];
    isAnonymous = array[6];
});

const walletPath = path.join(__dirname, 'wallet');
const mspOrg1 = 'Org1MSP';
const channelName = 'mychannel';
const chaincodeName = 'fabchat';

// const org1UserId = 'javascriptAppUser';

async function main() {
    try {
        // build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg1();

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

        // setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

        const userExists = await wallet.get(user);
        if (!userExists) {
            console.log(`An identity for the user ${user} does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        const gateway = new Gateway();

		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
				wallet,
				identity: user,
				discovery: { enabled: false, asLocalhost: false } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract = network.getContract(chaincodeName);

            if (choice === 'initLedger') {
                await contract.submitTransaction('initLedger');
                console.log(`${choice} Transaction has been submitted`);
            } else if (choice === 'createMsg') {
                await contract.submitTransaction('createMsg', msg, emailID, isAnonymous);
                console.log(`${choice} Transaction has been submitted`);
            } else if (choice === 'flagMsg') {
                await contract.submitTransaction('flagMsg', msg);
                console.log(`${choice} Transaction has been submitted`);
            } else {
                console.log(`${choice} is invalid!`);
            }
        } finally {
            // Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
        }
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
		process.exit(1);
	}



        // Create a new file system based wallet for managing identities.
        // const walletPath = path.join(process.cwd(), 'wallet');
        // const wallet = new FileSystemWallet(walletPath);
        // console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        // const userExists = await wallet.exists(user);
        // if (!userExists) {
        //     console.log(`An identity for the user ${user} does not exist in the wallet`);
        //     console.log('Run the registerUser.js application before retrying');
        //     return;
        // }

        // Create a new gateway for connecting to our peer node.
        // const gateway = new Gateway();
        // await gateway.connect(ccp, {wallet, identity: user, discovery: {enabled: false}});

        // Get the network (channel) our contract is deployed to.
        // const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        // const contract = network.getContract('fabchat');

        // Submit the specified transaction.
        // createMsg transaction - requires 5 argument, ex: ('createMsg', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // flagMsg transaction - requires 2 args , ex: ('flagMsg', 'CAR10', 'Dave')
        // if (choice === 'createMsg') {
        //     await contract.submitTransaction('createMsg', msg, emailID, isAnonymous);
        //     console.log(`${choice} Transaction has been submitted`);
        // } else if (choice === 'flagMsg') {
        //     await contract.submitTransaction('flagMsg', msg);
        //     console.log(`${choice} Transaction has been submitted`);
        // } else {
        //     console.log(`${choice} is invalid!`);
        // }

        // Disconnect from the gateway.
        // await gateway.disconnect();

    // } catch (error) {
    //     console.error(`Failed to submit transaction: ${error}`);
    //     process.exit(1);
    // }
}

main();