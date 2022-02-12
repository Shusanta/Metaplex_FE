import { Creator } from "../models/creator";
import explorerStore from "../store/Store";
import { MintStats } from "../models/mintStats";
import { mutatorAction } from "satcheljs";
import { NftInfo } from "../models/nftInfo";

export default mutatorAction(
  "setExplorerState",
  (creators: Creator[], mintStats: MintStats, nftInfo: NftInfo[]) => {
    explorerStore.creators = creators;
    explorerStore.mintStats = mintStats;
    explorerStore.nftInfo = nftInfo;
  }
);
