import { Image } from '@chakra-ui/image'
import { Box, Flex } from '@chakra-ui/layout'
import { FC } from 'react'

import loadingImg from '../../assets/img/daobookssvg.svg'

export const LoadingLogo: FC = () => (
  <div
    className="flex flex-wrap content-center justify-center"
    style={{ height: '80vh' }}
  >
    <Image
      className="object-center"
      src={loadingImg}
      mr="5"
      alt="Books"
      width={100}
      height={100}
    />
  </div>
)
