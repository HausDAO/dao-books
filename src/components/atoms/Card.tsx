import { Flex, FlexProps } from '@chakra-ui/layout'
import { FC } from 'react'

export const Card: FC<FlexProps> = ({ children, ...props }) => {
  return (
    <Flex
      direction="column"
      bg="brand.darkBlue1"
      p="6"
      border="1px solid rgba(255, 255, 255, 0.2)"
      borderRadius="md"
      boxShadow="0px 0px 50px 10px rgba(0, 0, 0, 0.05);"
      w="80"
      h="56"
      justify="space-between"
      {...props}
    >
      {children}
    </Flex>
  )
}
