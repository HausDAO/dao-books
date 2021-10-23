import { Image } from '@chakra-ui/image'
import { Flex } from '@chakra-ui/layout'
import { FC } from 'react'

import loadingImg from '../../assets/img/daobookssvg.svg'

export const LoadingLogo: FC = () => (
  <Flex
    sx={{ minHeight: 'calc(100vh - 10rem)' }}
    justify="center"
    align="center"
  >
    <Image src={loadingImg} alt="Books" w="32" h="32" />
  </Flex>
)
