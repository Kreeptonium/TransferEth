import Web3 from "web3";
import * as dotenv from "dotenv";
import { FeeMarketEIP1559Transaction } from "@ethereumjs/tx"; "@ethereumjs/tx";
import Common from "@ethereumjs/common";
import { EHOSTUNREACH } from "constants";

dotenv.config();

const transferEth = async():Promise<any>=>{

    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.rpcRopstenURL));

    const privateKey = Buffer.from(process.env.PRIVATE_KEY.replace('0x',''),'hex');

    const chain = new Common({chain:'ropsten',hardfork:'london'});

    const txNonce = await web3.eth.getTransactionCount(process.env.sendAddress,'pending');
    const baseFees = web3.utils.toNumber((await web3.eth.getBlock("latest")).baseFeePerGas);

    console.log("Base Fess: ", baseFees);

    var maxFeesPerGas = (baseFees*2)+2;

    const rawTx = {

        "to"                    :   web3.utils.toHex( process.env.receiveAddress ),
        "gasLimit"              :   web3.utils.toHex( 21000 ),
        "maxFeePerGas"          :   web3.utils.toHex( web3.utils.toWei(String(maxFeesPerGas), 'gwei' ) ),
        "maxPriorityFeePerGas"  :   web3.utils.toHex( web3.utils.toWei( '2' , 'gwei' ) ),
        "value"                 :   web3.utils.toHex( web3.utils.toWei( '0.0001' , 'ether' ) ),
        "nonce"                 :   web3.utils.toHex( txNonce ),
        "chainId"               :   "0x03", //Ropsten
        "type"                  :   "0x02"
    }


const tx = FeeMarketEIP1559Transaction.fromTxData(rawTx, { chain });

const signedTx = tx.sign(privateKey);

const serializedSignedTx = '0x' + signedTx.serialize().toString( 'hex' );

const sendingAddressBalance = await web3.eth.getBalance(process.env.sendAddress);
console.log( "Balance: " + sendingAddressBalance );

const txHash = await web3.utils.sha3(serializedSignedTx);
console.log( "Tx Hash: " + txHash );

await web3.eth.sendSignedTransaction(serializedSignedTx)
.on('error', function (error) {
    console.error( error );
})
.on('confirmation',async (confirmationNumber:number, receipt) => {
    console.log(confirmationNumber);
    console.log(receipt);
})
.on('receipt',async (txReceipt) => {
    console.log("signAndSendTx txReceipt. Tx Address: " + txReceipt.transactionHash);
})

};
transferEth().catch((error)=>{
    console.error("Error: ", error);
    process.exitCode=1;
})