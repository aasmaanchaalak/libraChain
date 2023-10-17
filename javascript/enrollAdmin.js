/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');

// const fs = require('fs');
// const path = require('path');

// const ccpPath = path.resolve(__dirname, '..', '..', 'basic-network', 'connection.json');
// const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
// const ccp = JSON.parse(ccpJSON);

const walletPath = path.join(__dirname, 'wallet');
const mspOrg1 = 'Org1MSP';

async function main() {
    try {
        // build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg1();

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

        // setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

        // in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

    
        // // Create a new CA client for interacting with the CA.
        // const caURL = ccp.certificateAuthorities['ca.example.com'].url;
        // const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        // const walletPath = path.join(process.cwd(), 'wallet');
        // const wallet = new FileSystemWallet(walletPath);
        // console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        // const adminExists = await wallet.exists('admin');
        // if (adminExists) {
        //     console.log('An identity for the admin user "admin" already exists in the wallet');
        //     return;
        // }

        // Enroll the admin user, and import the new identity into the wallet.
        // const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        // const identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
        // wallet.import('admin', identity);
        console.log('Successfully enrolled admin user "admin" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        process.exit(1);
    }
}

main();
