import ExplorerState from "./schema/ExplorerState";
import { createStore } from "satcheljs";

const explorerState: ExplorerState = {
  mintStats: undefined,
  creators: undefined,
  nftInfo: undefined,
  query: "",
};

export const getStore = createStore<ExplorerState>(
  "explorerState",
  explorerState
);

const explorerStore = getStore();
export default explorerStore;
