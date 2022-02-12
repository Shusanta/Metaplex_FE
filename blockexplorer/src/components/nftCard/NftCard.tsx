import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
export interface NftCardProps {
  name: string;
  uri: string;
}
export function NftCard(props: NftCardProps) {
  const { uri, name } = props;
  const [url, setUrl] = React.useState<any>('')
  React.useEffect(() => {
    const fetchImage= async (uri:string) =>  {
      let response = await fetch(uri); // fetch from the uri to get the image data field
      let data =  await response.json();
      setUrl(data.image);
    }
    fetchImage(uri)
    return () => {
    }
  }, [uri,name,url])
 
  return (
    <Card sx={{ maxWidth: 300, marginBottom: '20px'}} key={uri}> 
      <CardMedia
        component={"img"}
        image={url}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {name}
        </Typography>
      </CardContent>

    </Card>
  )
}

