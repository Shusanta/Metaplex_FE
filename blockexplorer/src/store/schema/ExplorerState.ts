import { Creator } from "../../models/creator";
import { MintStats } from "../../models/mintStats";
import { NftInfo } from "../../models/nftInfo";

export interface ExplorerState {
  query: string;
  mintStats: MintStats | undefined;
  creators: Creator[] | undefined;
  nftInfo: NftInfo[] | undefined;
}

export default ExplorerState;
