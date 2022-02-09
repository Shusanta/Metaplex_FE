import { PublicKey,Connection,clusterApiUrl } from "@solana/web3.js";
import { Buffer } from 'buffer';
const CANDY_MACHINE_V2_PROGRAM = new PublicKey('cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ');

export const getCandyMachineCreator = async (candyMachine: PublicKey): Promise<[PublicKey, number]> => (
  PublicKey.findProgramAddress(
    [Buffer.from('candy_machine'), candyMachine.toBuffer()],
    CANDY_MACHINE_V2_PROGRAM,
  )
);