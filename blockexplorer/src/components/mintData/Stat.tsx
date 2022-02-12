import React from "react";
import styles from "./MintData.module.scss";

export interface StatProps {
  primaryData: string | number;
  secondaryData?: string | number;
  isBold?: boolean;
}
//text wrapper for the mint data
export function Stat(props: StatProps) {
  const { isBold, primaryData, secondaryData } = props;

  return isBold ? ( // is Bold will make a defined header
    <h3 className={styles.stat}>{primaryData}</h3>
  ) : (
    <div className={styles.stat}>
      <div>{primaryData}</div>
      <div>{secondaryData}</div>
    </div>
  );
}
