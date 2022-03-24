const SHA256 = require('crypto-js/sha256')
const Block = require('./block.js');

class Blockchain {
  constructor() {
    this.chain = [];
    this.height = -1;
    this.initialize();
  }

  async initialize() {
    if (this.height === -1) {
      let block = new Block({ data: "Genesis Block" });
      await this.addBlock(block);
    }
  }

  addBlock(block) {
    let self = this;
    //
    return new Promise(async (resolve, reject) => {
      block.height = self.chain.length;
      block.time = new Date().getTime().toString();

      if (self.chain.length > 0) {
        block.previousBlockHash = self.chain[block.height-1].hash;
      }

      let errors = await self.validateChain();

      if (errors.length > 0) {
        reject(new Error("The chain isn't valid: ", errors));
      }

      block.hash = SHA256(JSON.stringify(block)).toString();

      self.chain.push(block);
      resolve(block);
    });
  }

  validateChain() {
    let self = this;
    const errors = [];
    //
    return new Promise(async (resolve, reject) => {
      self.chain.map(async (block) => {
        try {
          let isValid = await block.validate();
          if (!isValid) {
            errors.push(new Error(`The block ${block.height} isn't valid!`));
          }
        } catch (err) {
          errors.push(err)
        }
      });

      resolve(errors);
    });
  }

  print() {
    let self = this;
    for (let block of self.chain) {
      console.log(block.toString());
    }
  }
}
//
module.exports = Blockchain