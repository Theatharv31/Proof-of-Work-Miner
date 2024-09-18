const SHA256 = require('crypto-js/sha256');
const TARGET_DIFFICULTY = BigInt(0x0fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
const MAX_TRANSACTIONS = 10;

const mempool = [];
const blocks = [];

function addTransaction(transaction) {
    // Add the transaction to the mempool
    mempool.push(transaction);
}

function mine() {
    // Create a new transactions array specific to this block
    const transactions = [];

    // Include up to MAX_TRANSACTIONS from the mempool into the block
    for (let i = 0; i < Math.min(MAX_TRANSACTIONS, mempool.length); i++) {
        transactions.push(mempool[i]);
    }

    // Clear the processed transactions from the mempool
    mempool.splice(0, transactions.length);

    // Initialize the block with an id and transactions
    let newBlock = {
        id: blocks.length,       // Block height before adding the new block
        transactions: transactions,  // Add transactions to the block
        nonce: 0 // Initially set the nonce to 0
    };

    let blockHash = ""; // Initialize the block hash

    // Perform proof of work: Keep trying different nonces until the hash is below the target difficulty
    do {
        // Set the current nonce
        newBlock.nonce++;

        // Stringify the block and hash it
        const blockString = JSON.stringify(newBlock);
        blockHash = SHA256(blockString).toString();

    } while (BigInt(`0x${blockHash}`) >= TARGET_DIFFICULTY); // Check if the hash meets the target difficulty

    // Set the hash property on the block
    newBlock.hash = blockHash;

    // Push the mined block to the blocks array
    blocks.push(newBlock);
}

module.exports = {
    TARGET_DIFFICULTY,
    MAX_TRANSACTIONS,
    addTransaction,
    mine,
    blocks,
    mempool
};
