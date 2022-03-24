const Blockchain = require('./src/blockchain.js')
const Block = require('./src/block.js')

async function run() {
  const blockchain = await new Blockchain();
  const blocks = [
    { data: 'Block #1' },
    { data: 'Block #2' },
    { data: 'Block #3' },
  ];

  for (let block of blocks) {
    block = new Block({ data: block.data });
    await blockchain.addBlock(block);
  }

  blockchain.print();
}

run();