/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const {Contract} = require('fabric-contract-api');
const ClientIdentity = require('fabric-shim').ClientIdentity;

let bID = -1; //start key for books
let uID = 98; //start key for users
// list of users
let users = [];
let email = "";

class FabChat extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');

        const BookStartKey = '0';
        const BookEndKey = '99';
        const userEndKey = '99999' ;

        const iterator = await ctx.stub.getStateByRange(BookStartKey, BookEndKey);

        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                // console.log(res.value.value.toString('utf8'));
                let book;
                try {
                    book = JSON.parse(res.value.value.toString('utf8'));

                    bID += 1;

                } catch (err) {
                    console.log(err);
                    book = res.value.value.toString('utf8');
                }
            }

            if (res.done) {
                await iterator.close();
                console.log(`users: ${users}`);
                console.log(`numUsers: ${users.length}`);
                console.log(`lastMsgID: ${bID}`);
                break;
            }
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async registerStudent(ctx, email, name) {
        console.info('============= START : Register Student ===========');

        let cid = new ClientIdentity(ctx.stub);

        console.log(`Email : ${email}`);
        console.log(`Name : ${name}`);

        let lendingPeriod = 10;
        let currentBooks = [];

        uID += 1;
        let id = uID;

        const Student = {
            id,
            email,
            name,
            currentBooks,
            lendingPeriod
        };

        console.log("doing this");
        console.log(`${uID}`);
        
        await ctx.stub.putState(uID.toString(), Buffer.from(JSON.stringify(Student)));
        return JSON.stringify(uID);
        console.info('============= END : Added Student ===========');
    }

    async loginStudent(ctx, email) {
        let cid = new ClientIdentity(ctx.stub);

        const startKey = '99';
        const endKey = '199';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        let user;
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                // console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                
                try {
                    user = JSON.parse(res.value.value.toString('utf8'));

                    if (user.email == email){
                        return JSON.stringify(user.id);
                    }

                } catch (err) {
                    console.log(err);
                    user = res.value.value.toString('utf8');
                }
            }
        }
            await iterator.close();
            return "User not found.";
            console.info('============= END : Find User ===========');
    }

    async addBook(ctx, id, name, author, genre) {
        console.info('============= START : Add Book ===========');

        let cid = new ClientIdentity(ctx.stub);
        let userID = id;

        if (author === undefined) {
            author = "";
        }
        if (genre === undefined) {
            genre = "";
        }


        let owner = userID;

        console.log(`Book : ${name}`);
        console.log(`Author : ${author}`);
        console.log(`Genre : ${genre}`);
        console.log(`Owner : ${owner}`);

        const Book = {
            name,
            author,
            genre,
            owner
        };

        bID += 1;

        await ctx.stub.putState(bID.toString(), Buffer.from(JSON.stringify(Book)));
        console.info('============= END : Added Book ===========');
    }

    async updateBook(ctx, name, author, genre) {
        console.info('============= START : Update Book ===========');

        if (author === undefined) {
            author = "";
        }
        if (genre === undefined) {
            genre = "";
        }

        let cid = new ClientIdentity(ctx.stub);
        let userID = cid.getID();

        const startKey = '0';
        const endKey = '99';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        let book;
        let Key = -1;
        while (true) {
            const res = await iterator.next();
            
            if (res.value && res.value.value.toString()) {
                // console.log(res.value.value.toString('utf8'));

                Key = res.value.key;
                
                try {
                    book = JSON.parse(res.value.value.toString('utf8'));

                    // don't show flagged records
                    if (book.name == name) {
                        break;
                    }

                } catch (err) {
                    console.log(err);
                    book = res.value.value.toString('utf8');
                }
            }
        }

                if (book.owner != userID){
                    return "Books can only be edited by owners.";
                }
            //if (res.done) {
                await iterator.close();
                console.info(allResults);

                if (author == "NA" || book.author == author){
                    author = book.author
                }

                if (genre == "NA" || book.genre == genre){
                    genre = book.genre
                }

                console.log(`Book : ${name}`);
                console.log(`Author : ${author}`);
                console.log(`Genre : ${genre}`);

                let owner = book.owner;

                const Book = {
                    name,
                    author,
                    genre,
                    owner,
                };

                bID = parseInt(Key);

                if (Key != -1){
                    await ctx.stub.putState(bID.toString(), Buffer.from(JSON.stringify(Book)));
                }
                console.info('============= END : Added Book ===========');
                return JSON.stringify(Book);
            }
        //}        

    async getCatalogue(ctx) {
        console.info('============= START : queryAllBooks ===========');

        const startKey = '0';
        const endKey = '99';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                // console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let book;
                try {
                    book = JSON.parse(res.value.value.toString('utf8'));

                } catch (err) {
                    console.log(err);
                    book = res.value.value.toString('utf8');
                }
                allResults.push({Key, book});
            }
            if (res.done) {
                await iterator.close();
                console.info(allResults);
                console.log("vfvefvfev");
                console.info('============= END : queryAllBooks ===========');
                return JSON.stringify(allResults);
            }
        }
    }

    async getUsers(ctx) {
        console.info('============= START : getAllUsers ===========');

        const startKey = '99';
        const endKey = '199';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                // console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let user;
                try {
                    user = JSON.parse(res.value.value.toString('utf8'));

                } catch (err) {
                    console.log(err);
                    user = res.value.value.toString('utf8');
                }
                allResults.push({Key, user});
            }
            if (res.done) {
                await iterator.close();
                console.info(allResults);
                console.log("vfvefvfev");
                console.info('============= END : queryAllBooks ===========');
                return JSON.stringify(allResults);
            }
        }
    }

    async findBook(ctx, name, author, genre) {
        console.info('============= START : Find Book ===========');

        if (name === undefined) {
            name = "";
        }
        if (author == undefined) {
            author = "";
        }
          if (genre === undefined) {
            genre = "";
        }

        const startKey = '0';
        const endKey = '99';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                // console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let book;
                try {
                    book = JSON.parse(res.value.value.toString('utf8'));

                    if (name != "NA" && author != "NA" && genre != "NA"){
                        if (book.name === name && book.author === author && book.genre == genre){
                            allResults.push({Key, book});
                        }
                    } else if (name != "NA" && author != "NA"){
                        if (book.name === name && book.author === author){
                            allResults.push({Key, book});
                        }
                    } else if (name != "NA" && genre != "NA"){
                        if (book.name === name && book.genre === genre){
                            allResults.push({Key, book});
                        }
                    } else if (author != "NA" && genre != "NA"){
                        if (book.author === author && book.genre === genre){
                            allResults.push({Key, book});
                        }
                    } else if (name != "NA"){
                        if (book.name === name){
                            allResults.push({Key, book});
                        }
                    } else if (author != "NA"){
                        if (book.author === author){
                            allResults.push({Key, book});
                        }
                    } else if (genre != "NA"){
                        if (book.genre === genre){
                            allResults.push({Key, book});
                        }
                    }

                } catch (err) {
                    console.log(err);
                    purchase = res.value.value.toString('utf8');
                }
            }
            if (res.done) {
                await iterator.close();
                console.info(allResults);
                console.info('============= END : Find Books ===========');
                return JSON.stringify(allResults);
            }
        }
    }

    

    async issueBook(ctx, id, name) {
        console.info('============= START : Issue Book ===========');

        let cid = new ClientIdentity(ctx.stub);
        let issuer = id;

        let startKey = '99';
        let endKey = '199';

        let iterator = await ctx.stub.getStateByRange(startKey, endKey);

        let user;
        let Key;
        for (let i=10; i<30; i++) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                // console.log(res.value.value.toString('utf8'));

                Key = res.value.key;
                try {
                    user = JSON.parse(res.value.value.toString('utf8'));

                    if (user.id == issuer){
                        break;
                    } else{
                        return "USER NOT FOUND";
                    }

                } catch (err) {
                    console.log(err);
                    return err;
                    user = res.value.value.toString('utf8');
                }
            }
        }
        let issuerKey = Key;

        console.log(user);

        if (user.currentBooks && user.currentBooks.length == 3){
            return "You have already issued 3 books. Can't issue more."
        } else if (user.currentBooks){
            user.currentBooks.push(name);
        } else {
            user.currentBooks = new Array(name);
        }    

        let yo = await ctx.stub.putState(issuerKey, Buffer.from(JSON.stringify(user)));

        startKey = '0';
        endKey = '99';

        iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        let book;
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                // console.log(res.value.value.toString('utf8'));

                Key = res.value.key;
                
                try {
                    book = JSON.parse(res.value.value.toString('utf8'));

                    console.log(book);

                    // don't show flagged records
                    if (book.name === name) {
                        break;
                    } else {
                        return "No book found";
                    }

                } catch (err) {
                    console.log(err);
                    book = res.value.value.toString('utf8');
                }
            }
        }
        await iterator.close();
        console.info(allResults);

        let secs = ctx.stub.getTxTimestamp().seconds.low;
        const date = new Date(0);
        date.setUTCSeconds(secs);
        //date.toLocaleString('en-US', { timeZone: 'India/Mumbai' })
        let issueDate = (date.getDate()) + '/' +  (date.getMonth()+1) + '/' + date.getFullYear();

        name = book.name;
        let author = book.author;
        let genre = book.genre;
        let owner = book.owner;

        const Book = {
            name,
            author,
            genre,
            issuer,
            owner,
            issueDate
        };

        console.log(Book);

        bID = parseInt(Key);

        await ctx.stub.putState(bID.toString(), Buffer.from(JSON.stringify(Book)));
        console.info('============= END : Issue Book ===========');
    }

    async getUser(ctx, id){

        let cid = new ClientIdentity(ctx.stub);

        const startKey = '99';
        const endKey = '199';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        let user;
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                // console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                
                try {
                    user = JSON.parse(res.value.value.toString('utf8'));

                    if (user.id == id){
                        break;
                    }

                } catch (err) {
                    console.log(err);
                    user = res.value.value.toString('utf8');
                }
            }
        }
            await iterator.close();
            return JSON.stringify(user);
            console.info('============= END : Find User ===========');
    }

    async returnBook(ctx, id, name) {
        console.info('============= START : Return Book ===========');

        let cid = new ClientIdentity(ctx.stub);
        let returner = id;

        let startKey = '99';
        let endKey = '199';

        let iterator = await ctx.stub.getStateByRange(startKey, endKey);

        let user;
        let Key;
        for (let i=10; i<30; i++) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                // console.log(res.value.value.toString('utf8'));

                Key = res.value.key;
                try {
                    user = JSON.parse(res.value.value.toString('utf8'));

                    if (user.id == returner){
                        break;
                    } else{
                        return "USER NOT FOUND";
                    }

                } catch (err) {
                    console.log(err);
                    return err;
                    user = res.value.value.toString('utf8');
                }
            }
        }
        let returnerKey = Key;

        console.log(user);

        startKey = '0';
        endKey = '99';

        let iterator2 = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        let book;
        let bookKey;
        while (true) {
            const res = await iterator2.next();

            if (res.value && res.value.value.toString()) {
                // console.log(res.value.value.toString('utf8'));

                bookKey = res.value.key;
                
                try {
                    book = JSON.parse(res.value.value.toString('utf8'));

                    // don't show flagged records
                    if (book.name === name) {
                        break;
                    }

                } catch (err) {
                    console.log(err);
                    return err;
                    book = res.value.value.toString('utf8');
                }
            }
        }
                await iterator2.close();

                if (book.issuer != returner){
                    return "You can't return the book. Wrong ID."
                }

                book.issuer = "";
                
                let today = new Date(0);
                today.setUTCSeconds(ctx.stub.getTxTimestamp().seconds.low);

                let issue = new Date(book.issueDate.split("/")[1]+"/"+book.issueDate.split("/")[0]+"/"+book.issueDate.split("/")[2]);

                let diff = today.getTime() - issue.getTime();

                diff = diff / (1000*3600*24);

                if (diff > user.lendingPeriod){
                    user.lendingPeriod =  user.lendingPeriod-2;
                }

                book.issueDate = "";

                let author = book.author;
                let genre = book.genre;
                let owner = book.owner;
                let issueDate = book.issueDate;
                let issuer = book.issuer;

                console.log(`Book : ${name}`);
                console.log(`Author : ${author}`);
                console.log(`Genre : ${genre}`);

                const Book = {
                    name,
                    author,
                    genre,
                    owner,
                    issueDate,
                    issuer
                };

                bID = bookKey;
                
                for (let i = 0; i<3; i++){
                    if (user.currentBooks[i] == name){
                        console.log(user.currentBooks);
                        user.currentBooks.splice(i,1);
                        break;
                    }
                }

                console.log(user.currentBooks);

                await ctx.stub.putState(returnerKey, Buffer.from(JSON.stringify(user)));

                await ctx.stub.putState(bID.toString(), Buffer.from(JSON.stringify(Book)));
                console.info('============= END : Return Book ===========');
            
    }

    async createPurchase(ctx, date, outlet) {
        console.info('============= START : Create Purchase ===========');

        let cid = new ClientIdentity(ctx.stub);
        let userID = cid.getID();

        console.log(`Date : ${date}`);
        console.log(`Outlet : ${outlet}`);
        console.log(`userID  : ${userID}`);

        const flaggers = [];
        const flag = 0;

        const Purchase = {
            date,
            outlet,
            flag,
            flaggers,
            userID, 
        };

        // if new user, add user to users array
        if (!(users.includes(userID))) {
            console.log(`New user! Added to users array.`);
            users.push(userID);
        }

        pID += 1;
        

        await ctx.stub.putState(pID.toString(), Buffer.from(JSON.stringify(Purchase)));
        console.info('============= END : createPurchase ===========');
    }

    async queryPurchase(ctx, pID) {
        console.info('============= START : queryPurchaseByID ===========');
        console.log(`pID: ${pID}`);

        const purchaseAsBytes = await ctx.stub.getState(pID); // get the Purchase from chaincode state
        if (!purchaseAsBytes || purchaseAsBytes.length === 0) {
            throw new Error(`${pID} does not exist`);
        }
        let purchase;
        purchase = JSON.parse(purchaseAsBytes.toString());

        delete purchase.flaggers;

        console.log(purchase);
        console.info('============= END : queryPurchaseByID ===========');
        return JSON.stringify(purchase);
    }


    async queryAllPurchases(ctx) {
        console.info('============= START : queryAllPurchases ===========');

        const startKey = '10';
        const endKey = '99999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                // console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let purchase;
                try {
                    purchase = JSON.parse(res.value.value.toString('utf8'));

                } catch (err) {
                    console.log(err);
                    purchase = res.value.value.toString('utf8');
                }
                allResults.push({Key, purchase});
            }
            if (res.done) {
                await iterator.close();
                console.info(allResults);
                console.info('============= END : queryAllPurchases ===========');
                return JSON.stringify(allResults);
            }
        }
    }

    async queryAllUnflagged(ctx) {
        console.info('============= START : queryAllUnflaggedPurchases ===========');

        const startKey = '10';
        const endKey = '99999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                // console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let purchase;
                try {
                    purchase = JSON.parse(res.value.value.toString('utf8'));

                    // don't show flagged records
                    if (purchase.flag === 1) {
                        continue;
                    }

                } catch (err) {
                    console.log(err);
                    purchase = res.value.value.toString('utf8');
                }
                allResults.push({Key, purchase});
            }
            if (res.done) {
                await iterator.close();
                console.info(allResults);
                console.info('============= END : queryAllUnflagged ===========');
                return JSON.stringify(allResults);
            }
        }
    }

    async queryUser(ctx) {
        console.info('============= START : queryAllUser ===========');

        let cid = new ClientIdentity(ctx.stub);
        let flagger = cid.getID();

        return flagger;
    }

    async flagPurchase(ctx, pID) {
        console.info('============= START : Verify Purchase ===========');

        let cid = new ClientIdentity(ctx.stub);
        let flagger = cid.getID();
        let threshold = Math.ceil(0.5 * users.length);

        console.log(`pID: ${pID}`);
        console.log(`flagger  : ${flagger}`);

        const purchaseAsBytes = await ctx.stub.getState(pID); // get the ppurchase from chaincode state
        if (!purchaseAsBytes || purchaseAsBytes.length === 0) {
            throw new Error(`${pID} does not exist`);
        }
        const purchase = JSON.parse(purchaseAsBytes.toString());

        /* flag only if:
			1. flagger is not trying to flag its own purchase
			2. flagger has not already flagged the purchase
			3. flagger is not trying to flagged purchase
			4. flagger is not trying to flag a msg with flag = -1
        */
        if ((flagger !== purchase.userID) && !(purchase.flaggers.includes(flagger)) && (purchase.flag !== -1)) { //OUTLET CHECK

            // push new flagger in flaggers array
            purchase.flaggers.push(flagger);
            // increment flag
            purchase.flag += 1;

            console.log(`pID ${pID} flagged successfully!`);

        } else {
            throw new Error(`Cannot flag purchase!`);
        }

        await ctx.stub.putState(pID, Buffer.from(JSON.stringify(purchase)));
        console.info('============= END : flag Purchase ===========');
    }

    async redeemReward(ctx, rID) {
        console.info('============= START : Redeem Reward ===========');

        let cid = new ClientIdentity(ctx.stub);
        let userID = cid.getID();

        console.log(`userID: ${userID}`);
        console.log(`rID: ${rID}`);

        const startKey = '10';
        const endKey = '99999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey); //getting all purchase transactions

        const allResults = [];
        const date = [];
        var count = 0;
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                // console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let purchase;
    
                try {
                    purchase = JSON.parse(res.value.value.toString('utf8'));

                    // don't show others' purchases

                    if (purchase.userID != userID) {
                        continue;
                    }
                    
                    //dont't show unflagged purchases
                    if (purchase.flag === -1 || purchase.flag === 0) {
                        continue;
                    }

                    //count no. of consecutive purchases
                    if (!date[0]){
                        date[0] = parseInt(purchase.date);
                    } else if (parseInt(purchase.date) == date[0]+1){
                        count += 1;
                        date[0] = parseInt(purchase.date);
                    } else {
                        count = 0;
                        date[0] = parseInt(purchase.date);
                    }

                } catch (err) {
                    console.log(err);
                    purchase = res.value.value.toString('utf8');
                }
            }
            if (res.done) {
                await iterator.close();
                break;
            }
        }

        const rewardAsBytes = await ctx.stub.getState(rID); // get the reward from chaincode state
        if (!rewardAsBytes || rewardAsBytes.length === 0) {
            throw new Error(`${rID} does not exist`);
        }
        const reward = JSON.parse(rewardAsBytes.toString());

        if (count >= 7) {

            // change reward ownership
            reward.owner=userID;

            console.log(`rID ${rID} redeemed successfully!`);
        } else {
            throw new Error(`Cannot redeem!`);
        }

        await ctx.stub.putState(rID, Buffer.from(JSON.stringify(reward)));
        console.info('============= END : Redeem Reward ===========');
    }
    

}

module.exports = FabChat;
