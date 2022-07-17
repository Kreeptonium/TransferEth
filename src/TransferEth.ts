import Web3 from "web3";
import * as dotenv from "dotenv";
import { FeeMarketEIP1559Transaction } from "@ethereumjs/tx"; "@ethereumjs/tx";
import Common from "@ethereumjs/common";

dotenv.config();

const transferEth = async():Promise<any>=>{

    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.rpcRopstenURL));

    const privateKey = Buffer.from(process.env.PRIVATE_KEY.replace('0x',''),'hex');

    const chain = new Common({chain:'Ropsten',hardfork:'london'});

    const txNonce = await web3.eth.getTransactionCount(process.env.sendAddress,'pending');
    const baseFees = web3.utils.toNumber((await web3.eth.getBlock("latest")).baseFeePerGas);

    console.log("Base Fess: ", baseFees);





}
transferEth().catch((error)=>{
    console.error("Error: ", error);
    process.exitCode=1;
})