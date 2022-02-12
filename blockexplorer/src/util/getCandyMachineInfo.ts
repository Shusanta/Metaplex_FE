import { Buffer } from 'buffer';
import bs58 from 'bs58';
import { NftInfo } from '../models/nftInfo';
import { Creator } from '../models/creator';
import setExplorerState from '../mutators/setExplorerState';

(window as any).global = window; // need this because create-react-app is weird with libs
// @ts-ignore
window.Buffer = window.Buffer || Buffer;

const MAX_NAME_LENGTH = 32;
const MAX_URI_LENGTH = 200;
const MAX_SYMBOL_LENGTH = 10;
const MAX_CREATOR_LEN = 32 + 1 + 1;
const MAX_CREATOR_LIMIT = 5;

const CONFIG_ARRAY_START = 8 + // key
    32 + // authority
    32 + //wallet
    33 + // token mint
    8 + // items_redeemed
    4 + 6 + // uuid
    8 +//price
    4 + MAX_SYMBOL_LENGTH + // u32 len + symbol
    2 + // seller fee basis points
    8 + //max supply
    1 + // is mutable
    1 + // retain authority
    9 + // go live
    10 +// end settings
    4 + MAX_CREATOR_LIMIT * MAX_CREATOR_LEN + // optional + u32 len + actual vec
    1 + // option for hidden setting
    4 + MAX_NAME_LENGTH + // name length,
    4 + MAX_URI_LENGTH + // uri length,
    32 + // hash
    1 + // whitelist option
    1 + // whitelist mint mode
    1 + // allow presale
    9 + // discount price
    32 + // mint key for whitelist
    + 8 +// items available
  1 + 32 + 1 // gatekeeper
    +4 // max num of lines

// This could definitely be simplified with a number of interfaces as well as the adding of numbers. I wanted to show my decoding process and understanding.
export const getCandyMachineInfo = async (data: Buffer) => {
  if (data) {

    const tokenMintSpace = data.slice(8 + // key
      32 + // authority
      32, //wallet
      8 + // key
      32 + // authority
      32 + //wallet
      1).readUInt8() === 1 ? 33 : 1;

    const itemsRedeemed = Number(data.slice(
      8 + // key
      32 + // authority
      32 + //wallet
      tokenMintSpace  // token mint
      ,
      8 + // key
      32 + // authority
      32 + //wallet
      tokenMintSpace + // token mint
      8).readBigUInt64LE())//price,

    const price = data.slice(
      8 + // key
      32 + // authority
      32 + //wallet
      tokenMintSpace + // token mint
      8 + // items_redeemed
      4 + 6 // uuid
      ,
      8 + // key
      32 + // authority
      32 + //wallet
      tokenMintSpace + // token mint
      8 + // items_redeemed
      4 + 6 + // uuid
      8) // price
      .readBigUInt64LE()

    const royalty = data.slice(
      8 + // key
      32 + // authority
      32 + //wallet
      tokenMintSpace + // token mint
      8 + // items_redeemed
      4 + 6 + // uuid
      8 +//price
      4 + MAX_SYMBOL_LENGTH // u32 len + symbol
      , //max supply
      8 + // key
      32 + // authority
      32 + //wallet
      tokenMintSpace + // token mint
      8 + // items_redeemed
      4 + 6 + // uuid
      8 +//price
      4 + MAX_SYMBOL_LENGTH + // u32 len + symbol
      2).readUInt16LE()

    const goLiveDateSpace = data.slice(
      8 + // key
      32 + // authority
      32 + //wallet
      tokenMintSpace + // token mint
      8 + // items_redeemed
      4 + 6 + // uuid
      8 +//price
      4 + MAX_SYMBOL_LENGTH + // u32 len + symbol
      2 + // seller fee basis points
      8 + //max supply
      1 + // is mutable
      1  // retain authority
      ,
      8 + // key
      32 + // authority
      32 + //wallet
      33 + // token mint
      8 + // items_redeemed
      4 + 6 + // uuid
      8 +//price
      4 + MAX_SYMBOL_LENGTH + // u32 len + symbol
      2 + // seller fee basis points
      8 + //max supply
      1 + // is mutable
      1 + // retain authority
      1).readUInt8() === 1 ? 9 : 1 // go live)

    const goliveDate = goLiveDateSpace === 9 && data.slice(
      8 + // key
      32 + // authority
      32 + //wallet
      tokenMintSpace + // token mint
      8 + // items_redeemed
      4 + 6 + // uuid
      8 +//price
      4 + MAX_SYMBOL_LENGTH + // u32 len + symbol
      2 + // seller fee basis points
      8 + //max supply
      1 + // is mutable
      1  // retain authority
      +1
      ,
      8 + // key
      32 + // authority
      32 + //wallet
      33 + // token mint
      8 + // items_redeemed
      4 + 6 + // uuid
      8 +//price
      4 + MAX_SYMBOL_LENGTH + // u32 len + symbol
      2 + // seller fee basis points
      8 + //max supply
      1 + // is mutable
      1 + // retain authority
      1 + 8).readBigInt64LE()

    const endSettingsSpace = data.slice(
      8 + // key
      32 + // authority
      32 + //wallet
      tokenMintSpace + // token mint
      8 + // items_redeemed
      4 + 6 + // uuid
      8 +//price
      4 + MAX_SYMBOL_LENGTH + // u32 len + symbol
      2 + // seller fee basis points
      8 + //max supply
      1 + // is mutable
      1 + // retain authority
      goLiveDateSpace
      ,
      8 + // key
      32 + // authority
      32 + //wallet
      33 + // token mint
      8 + // items_redeemed
      4 + 6 + // uuid
      8 +//price
      4 + MAX_SYMBOL_LENGTH + // u32 len + symbol
      2 + // seller fee basis points
      8 + //max supply
      1 + // is mutable
      1 + // retain authority
      goLiveDateSpace + 1).readUInt8() === 1 ? 10 : 1;

    const creatorsLength = data.slice(
      8 + // key
      32 + // authority
      32 + //wallet
      tokenMintSpace + // token mint
      8 + // items_redeemed
      4 + 6 + // uuid
      8 +//price
      4 + MAX_SYMBOL_LENGTH + // u32 len + symbol
      2 + // seller fee basis points
      8 + //max supply
      1 + // is mutable
      1 + // retain authority
      goLiveDateSpace
      + endSettingsSpace
      ,
      8 + // key
      32 + // authority
      32 + //wallet
      33 + // token mint
      8 + // items_redeemed
      4 + 6 + // uuid
      8 +//price
      4 + MAX_SYMBOL_LENGTH + // u32 len + symbol
      2 + // seller fee basis points
      8 + //max supply
      1 + // is mutable
      1 + // retain authority
      goLiveDateSpace +
      endSettingsSpace + 4).readUInt8();

    let creatorSpace = 4;

    let creatorOffset = 8 + // key
      32 + // authority
      32 + //wallet
      tokenMintSpace + // token mint
      8 + // items_redeemed
      4 + 6 + // uuid
      8 +//price
      4 + MAX_SYMBOL_LENGTH + // u32 len + symbol
      2 + // seller fee basis points
      8 + //max supply
      1 + // is mutable
      1 + // retain authority
      goLiveDateSpace
      + endSettingsSpace
      + 4
    const creators:Creator[]= []
    if (creatorsLength) {
      creatorSpace += creatorsLength * MAX_CREATOR_LEN;
      for (let index = 0; index < creatorsLength; index++) {
        const creatorPubKey = data.slice(creatorOffset, creatorOffset + 32);
        const creatorShare = data.slice(creatorOffset + 33, creatorOffset + 34).readUInt8().toString()+ '%'
        creators.push({ creatorAddress: bs58.encode(creatorPubKey), creatorShare: creatorShare })
        creatorOffset += 34
      }
    }

    const hiddenSettingsSpace = data.slice(
      8 + // key
      32 + // authority
      32 + //wallet
      tokenMintSpace + // token mint
      8 + // items_redeemed
      4 + 6 + // uuid
      8 +//price
      4 + MAX_SYMBOL_LENGTH + // u32 len + symbol
      2 + // seller fee basis points
      8 + //max supply
      1 + // is mutable
      1 + // retain authority
      goLiveDateSpace
      + endSettingsSpace
      + creatorSpace
      ,
      8 + // key
      32 + // authority
      32 + //wallet
      33 + // token mint
      8 + // items_redeemed
      4 + 6 + // uuid
      8 +//price
      4 + MAX_SYMBOL_LENGTH + // u32 len + symbol
      2 + // seller fee basis points
      8 + //max supply
      1 + // is mutable
      1 + // retain authority
      goLiveDateSpace + endSettingsSpace + creatorSpace + 1).readUInt8() === 0 ? 1 : (1 + 4 + MAX_NAME_LENGTH + // name length,
        4 + MAX_URI_LENGTH + // uri length,
        32) // hash

    // white list settings has an option we need to account for
    const whiteListOption = data.slice(
      8 + // key
      32 + // authority
      32 + //wallet
      tokenMintSpace + // token mint
      8 + // items_redeemed
      4 + 6 + // uuid
      8 +//price
      4 + MAX_SYMBOL_LENGTH + // u32 len + symbol
      2 + // seller fee basis points
      8 + //max supply
      1 + // is mutable
      1 + // retain authority
      goLiveDateSpace
      + endSettingsSpace
      + creatorSpace
      + hiddenSettingsSpace
      ,
      8 + // key
      32 + // authority
      32 + //wallet
      33 + // token mint
      8 + // items_redeemed
      4 + 6 + // uuid
      8 +//price
      4 + MAX_SYMBOL_LENGTH + // u32 len + symbol
      2 + // seller fee basis points
      8 + //max supply
      1 + // is mutable
      1 + // retain authority
      goLiveDateSpace + endSettingsSpace + creatorSpace + hiddenSettingsSpace + 1).readUInt8();

    // use that same option to get the total size
    const whiteListSpace = whiteListOption ? data.slice(
      8 + // key
      32 + // authority
      32 + //wallet
      tokenMintSpace + // token mint
      8 + // items_redeemed
      4 + 6 + // uuid
      8 +//price
      4 + MAX_SYMBOL_LENGTH + // u32 len + symbol
      2 + // seller fee basis points
      8 + //max supply
      1 + // is mutable
      1 + // retain authority
      goLiveDateSpace
      + endSettingsSpace
      + creatorSpace
      + hiddenSettingsSpace
      + 1+ 32 +1  // mode mint and bool
      ,
      8 + // key
      32 + // authority
      32 + //wallet
      33 + // token mint
      8 + // items_redeemed
      4 + 6 + // uuid
      8 +//price
      4 + MAX_SYMBOL_LENGTH + // u32 len + symbol
      2 + // seller fee basis points
      8 + //max supply
      1 + // is mutable
      1 + // retain authority
      goLiveDateSpace + endSettingsSpace + creatorSpace + hiddenSettingsSpace + 1 +1 + 32+1).readUInt8() === 1 ? 44 : 36 : 1 //discount price is 8 bytes and the 32 bytes is from the pubkey
  
    const itemsAvailable = Number (data.slice(
      8 + // key
      32 + // authority
      32 + //wallet
      tokenMintSpace + // token mint
      8 + // items_redeemed
      4 + 6 + // uuid
      8 +//price
      4 + MAX_SYMBOL_LENGTH + // u32 len + symbol
      2 + // seller fee basis points
      8 + //max supply
      1 + // is mutable
      1 + // retain authority
      goLiveDateSpace
      + endSettingsSpace
      + creatorSpace
      + hiddenSettingsSpace
      + whiteListSpace
      ,
      8 + // key
      32 + // authority
      32 + //wallet
      33 + // token mint
      8 + // items_redeemed
      4 + 6 + // uuid
      8 +//price
      4 + MAX_SYMBOL_LENGTH + // u32 len + symbol
      2 + // seller fee basis points
      8 + //max supply
      1 + // is mutable
      1 + // retain authority
      goLiveDateSpace + endSettingsSpace + creatorSpace + hiddenSettingsSpace + whiteListSpace+ 8).readBigUInt64LE())

    // How I am iterating through : const CONFIG_LINE_SIZE = 4 + MAX_NAME_LENGTH + 4 + MAX_URI_LENGTH;
    let configOffset = CONFIG_ARRAY_START + 4 ;

    const nftInfo: NftInfo[] = []

    for (let index = 0; index < itemsAvailable; index++){
      const nftName = data.slice(configOffset, configOffset + 32).toString();
      configOffset += 36
      const nftUri = data.slice(configOffset+4, configOffset + 200).toString();
      configOffset += 204
      nftInfo.push({name:nftName, uri:nftUri})
    }

    const mintStats = ({
      goliveDate: new Date(Number(goliveDate) * 1000),
      itemsAvailable: itemsAvailable,
      itemsRedeemed: itemsRedeemed,
      royalties: (royalty / 100) + '%',
      price: Number(price) / 1000000000,
      itemsRemaining: itemsAvailable - itemsRedeemed
    })

    setExplorerState(creators,mintStats,nftInfo)
  };
}


