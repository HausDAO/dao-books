import { Button as ChakraButton, ButtonProps } from '@chakra-ui/button'
import { FC } from 'react'

export const Button: FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <ChakraButton colorScheme="secondary" color="primary.700" {...props}>
      {children}
    </ChakraButton>
  )
}
