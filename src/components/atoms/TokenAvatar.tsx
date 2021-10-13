import { Avatar } from '@chakra-ui/avatar'
import { FC, useEffect, useState } from 'react'

import { Token } from '../../types/DAO'
import { getTokenImage } from '../../utils/web3/token'

export const TokenAvatar: FC<{ token: Token }> = ({ token }) => {
  const [image, setImage] = useState<string>()
  useEffect(() => {
    const getImage = async () => {
      const image = await getTokenImage(token.tokenAddress)
      setImage(image)
    }
    getImage()
  }, [])
  return (
    <Avatar w="6" h="6" src={image} name={token.symbol} title={token.symbol} />
  )
}
