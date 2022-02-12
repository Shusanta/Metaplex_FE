import { orchestrator } from "satcheljs";
import { setCandyMachineInfo } from "../actions/setCandyMachineInfo";
import { getCandyMachineInfo } from "../util/getCandyMachineInfo";

orchestrator(setCandyMachineInfo, async (actionMessage) => {
  await getCandyMachineInfo(actionMessage.data);
});
