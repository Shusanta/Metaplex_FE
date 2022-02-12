import React from "react";
import styles from "./SearchBar.module.scss";
import { setCandyMachineInfo } from "../../actions/setCandyMachineInfo";
import TextField from "@mui/material/TextField";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";

const rpcHost = "https://ssc-dao.genesysgo.net/";
const connection = new anchor.web3.Connection(rpcHost);
const CANDY_MACHINE_PROGRAM = new anchor.web3.PublicKey(
  "cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ"
);
export function SearchBar() {
  const [inputText, setInputText] = React.useState("");
  const [isValidSearch, setIsValidSearch] = React.useState(true);

  const onKeyDownHandler = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.code === "Enter") {
      let candyMachineInfo;
      try {
        candyMachineInfo = await connection?.getAccountInfo(
          new PublicKey(inputText)
        );
      } catch {
        setIsValidSearch(false);
        return;
      }
      if (
        candyMachineInfo?.owner.toBase58() !== CANDY_MACHINE_PROGRAM.toBase58()
      ) {
        // The owner has to be the candy machine program
        setIsValidSearch(false);
        return;
      }
      setIsValidSearch(true);
      setCandyMachineInfo(candyMachineInfo.data);
    }
  };

  return (
    <div className={styles.searchBarContainer}>
      <TextField
        error={!isValidSearch}
        placeholder="Enter Post Title"
        onKeyDown={onKeyDownHandler}
        className={styles.searchBar}
        onChange={(event) => setInputText(event.target.value)}
        id="outlined-basic"
        label="Enter CmV2 public key"
        variant="outlined"
      />
    </div>
  );
}
