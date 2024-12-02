import dotenv from "dotenv";
dotenv.config();
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

  
  export async function sendSui(
    amount,
    recipientAddress,
    privateKey
  ) {
    try {
      // Connect to Sui network (mainnet)
      const provider = new SuiClient({ url: getFullnodeUrl("devnet") });
      
      // Create keypair from private key
      const keypair = Ed25519Keypair.fromSecretKey(privateKey);
        
      // Create transaction block
      const tx = new Transaction();
      
      // Add transfer operation
      tx.transferObjects([
        tx.splitCoins(tx.gas, [amount])
      ], recipientAddress);
    
        // Sign and execute the transaction
      const result = await provider.signAndExecuteTransaction({
        transaction: tx, signer: keypair
      });
      console.log(result);
  
      return {
        success: true,
        digest: result.digest,
        status: result.effects?.status
      };
  
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Example usage
  const amount = BigInt(98931245); // Amount in MIST (1 SUI = 1000000000 MIST)
  const recipientAddress = '0xc37d6b9fcc5dc3314bdb906c8bdfdb1f42322b3bd6c2e0655e7fa38a6df51baf'; // Recipient's Sui address
  const privateKey = process.env.SECRET_KEY;
  
  sendSui(amount, recipientAddress, privateKey)
    .then(console.log)
    .catch(console.error);