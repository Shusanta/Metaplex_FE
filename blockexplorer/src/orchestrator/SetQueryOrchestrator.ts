import { orchestrator } from 'satcheljs';
import { setQuery } from '../actions/setQuery';
import { getCandyMachineCreator } from '../util/getCandyMachineCreator';
import { PublicKey } from "@solana/web3.js";
import { getTokenMetadata } from '../util/getTokenMetadata';

orchestrator(setQuery, async (actionMessage) => {
  const query = actionMessage.query;

  const candyMachineCreatorInfo = await getCandyMachineCreator(new PublicKey(query));

  const tokenMetadata = await getTokenMetadata(candyMachineCreatorInfo[0])

})