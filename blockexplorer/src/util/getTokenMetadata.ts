import React from 'react';
import { SearchBar } from '../components/searchBar/SearchBar';
import { MintData } from '../components/mintData/MintData';
import styles from './App.module.scss'
import { PublicKey } from "@solana/web3.js";
import { Buffer } from 'buffer';
import bs58 from 'bs58';
import { sha256 } from "js-sha256";
import * as anchor from "@project-serum/anchor";


const rpcHost = "https://ssc-dao.genesysgo.net/"
const connection = new anchor.web3.Connection(rpcHost);

const candyMachineId = '9tQLFyLeaUwQ1PN2YDiFztZDxu4KT6px8CBYEapkshAD';
const CANDY_MACHINE_V2_PROGRAM = new PublicKey('cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ');
const MAX_NAME_LENGTH = 32;
const MAX_URI_LENGTH = 200;
const MAX_SYMBOL_LENGTH = 10;
const MAX_CREATOR_LEN = 32 + 1 + 1;
const MAX_CREATOR_LIMIT = 5;
const MAX_DATA_SIZE = 4 + MAX_NAME_LENGTH + 4 + MAX_SYMBOL_LENGTH + 4 + MAX_URI_LENGTH + 2 + 1 + 4 + MAX_CREATOR_LIMIT * MAX_CREATOR_LEN;
const MAX_METADATA_LEN = 1 + 32 + 32 + MAX_DATA_SIZE + 1 + 1 + 9 + 172;
const CREATOR_ARRAY_START = 1 + 32 + 32 + 4 + MAX_NAME_LENGTH + 4 + MAX_URI_LENGTH + 4 + MAX_SYMBOL_LENGTH + 2 + 1 + 4;
const TOKEN_METADATA_PROGRAM = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

export const getTokenMetadata = async (firstCreatorAddress: PublicKey) => {

  const metadataAccounts = await connection.getProgramAccounts(
    TOKEN_METADATA_PROGRAM,
    {
      filters: [
        // Only get Metadata accounts.
        { dataSize: MAX_METADATA_LEN },

        // Filter using the first creator.
        {
          memcmp: {
            offset: CREATOR_ARRAY_START,
            bytes: firstCreatorAddress.toBase58(),
          },
        },
      ],
    },
  );

  return metadataAccounts.map((metadataAccountInfo) => {
    //metadataAccountInfo.pubkey.toBase58(); // get the public key of every single Metadata account
    const nameLength =metadataAccountInfo.account.data.slice(1 + 32 + 32 , 1 + 32 + 32 + 4);
    const nameBuffer = metadataAccountInfo.account.data.slice(1 + 32 + 32 + 4, 1 + 32 + 32 + 4 + 32);
    //return nameBuffer.toString();
    let parsedName = ''
    for (let charIdx = 0; charIdx < nameLength.readUInt32LE(); charIdx++) {
      const currentCharacter = nameBuffer.readUInt8(charIdx);
      if (currentCharacter == 0) {
        break;
      }
      parsedName += String.fromCharCode(currentCharacter)
    }
    return parsedName;

  });
};