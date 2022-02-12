import React from 'react';
import styles from './MintData.module.scss';
import { observer } from 'mobx-react-lite';
import explorerStore from '../../store/Store'
import { Stat } from './Stat';
import { Creator } from '../../models/creator';
export default observer(function MintData() {
  if (!explorerStore?.mintStats) {
    return (<> </>);
  }
  const {goliveDate, itemsAvailable,
    itemsRedeemed,
    itemsRemaining,
    royalties,
    price} = explorerStore?.mintStats
  
  return (
    <div className={styles.mintDataContainer}>
      <div>
        <Stat primaryData = {'Mint Price'} isBold={true} />
        <Stat primaryData={price.toString()} />
        <div>
        <Stat primaryData={'Live Date'} isBold={true} />
        <Stat primaryData={goliveDate.toDateString()} />
        </div>
      </div>
      <div>
        <Stat primaryData={'Mint Stats'} isBold={true} />
        <Stat primaryData={'Items Available'} secondaryData={itemsAvailable} />
        <Stat primaryData={'Items Redeemed'} secondaryData={itemsRedeemed} />
        <Stat primaryData={'Items Remaining'} secondaryData={itemsRemaining} />
        <Stat primaryData={'Royalty'} secondaryData={royalties} />
      </div>
      <div>
        <Stat primaryData={'Creators'} isBold={true} />
        {creatorInfo(explorerStore.creators)}
      </div>
    </div>
  )
})

const creatorInfo = (creators: Creator[]| undefined) => {
  return creators?.map((creator) => {
    const creatorAddress = creator.creatorAddress
    return (
      <Stat key={creatorAddress} primaryData={creatorAddress.slice(0,4)+ '...' +creator.creatorAddress.slice(creatorAddress.length -4)} secondaryData= {creator.creatorShare} /> // slice the pub key to fit on the screen
    )
  })

}