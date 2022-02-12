import React from 'react';
import styles from './NftGallery.module.scss';
import Button from '@mui/material/Button';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import explorerStore from '../../store/Store';
import { observer } from 'mobx-react-lite';
import { NftInfo } from '../../models/nftInfo';
import {NftCard} from '../nftCard/NftCard';
export default observer(function NftGallery() {
  const [galleryIndex, setGalleryIndex] = React.useState<any>(0)
  const nftInfo = explorerStore.nftInfo;

  const onForwardClick = (() => {
    if (nftInfo) {
      const maxIndex = nftInfo?.length ;
      setGalleryIndex(Math.min(maxIndex - 9, galleryIndex + 9));
    }
  })
  const onBackwardClick = (() => {
    if (nftInfo) {
      const minIndex = 0;
      setGalleryIndex(Math.max(minIndex, galleryIndex - 9));
    }
  })
  return (
    <div className={styles.nftGalleryContainer}>
      <div className={styles.navigationHeader} >
        {nftInfo && (
          <>
            <Button disabled={galleryIndex === 0 } variant="outlined" startIcon={<ArrowBack />} onClick={onBackwardClick}>
            Prev
            </Button>
            <Button disabled={galleryIndex === nftInfo?.length - 10}variant="outlined" startIcon={<ArrowForward />} onClick={onForwardClick}>
            Next
            </Button>
          </>
        )}
      </div>
      <div className={styles.nftDisplayContainer}>
        {nftInfo?.slice(galleryIndex, galleryIndex + 9)?.map((nft: NftInfo) => {
          const { name, uri } = nft;
          return <NftCard name={name} uri={uri} key={name}/>
        })}
      </div>
    </div>
  )
})