import { Creator } from './creator';
import { MintStats } from './mintStats'
import { NftInfo } from './nftInfo';

export interface CandyMachineInfo {
  mintStats: MintStats;
  creators: Creator[];
  nftInfo: NftInfo[]
}