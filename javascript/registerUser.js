/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Gateway, Wallets } = require('fabric-network');

const { buildCAClient, registerAndEnrollUser } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');

// const fs = require('fs');
// const path = require('path');

// const ccpPath = path.resolve(__dirname, '..', '..', 'basic-network', 'connection.json');
// const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
// const ccp = JSON.parse(ccpJSON);
let user;

process.argv.forEach(function (val, index, array) {
    user = array[2];
});

const walletPath = path.join(__dirname, 'wallet');
const mspOrg1 = 'Org1MSP';
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

        // in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, user, 'org1.department1');

        // Create a new file system based wallet for managing identities.
        // const walletPath = path.join(process.cwd(), 'wallet');
        // const wallet = new FileSystemWallet(walletPath);
        // console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        // const userExists = await wallet.exists(user);
        // if (userExists) {
        //     console.log(`An identity for the user ${user} already exists in the wallet`);
        //     return;
        // }

        // Check to see if we've already enrolled the admin user.
        // const adminExists = await wallet.exists('admin');
        // if (!adminExists) {
        //     console.log('An identity for the admin user "admin" does not exist in the wallet');
        //     console.log('Run the enrollAdmin.js application before retrying');
        //     return;
        // }

       
        // await gateway.connect(ccp, {wallet, identity: 'admin', discovery: {enabled: false}});

        // Get the CA client object from the gateway for interacting with the CA.
        // const ca = gateway.getClient().getCertificateAuthority();
        // const adminIdentity = gateway.getCurrentIdentity();

        // Register the user, enroll the user, and import the new identity into the wallet.
        // const secret = await ca.register({
        //     affiliation: 'org1.department1',
        //     enrollmentID: user,
        //     role: 'client'
        // }, adminIdentity);
        // const enrollment = await ca.enroll({enrollmentID: user, enrollmentSecret: secret});
        // const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
        // wallet.import(user, userIdentity);
        console.log(`Successfully registered and enrolled admin user ${user} and imported it into the wallet`);

    } catch (error) {
        console.error(`Failed to register user ${user}: ${error}`);
        process.exit(1);
    }
}

main();
