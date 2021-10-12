import { extendTheme } from '@chakra-ui/react'

const colors = {
  brand: {
    darkBlue1: '#050A1B',
    darkBlue2: '#0E1235',
  },
  interface: {
    orange: '#ED963A',
  },
}

const Heading = {
  variants: {
    h1: {
      fontSize: '3xl',
      weight: 'bold',
      lineHeight: '2.625rem',
    },
    h2: {
      fontSize: '2xl',
      weight: 'bold',
      lineHeight: '9',
    },
  },
}

const Input = {
  variants: {
    outline: {
      field: {
        borderColor: 'white',
        bg: 'transparent',
      },
    },
  },
  defaultProps: {
    variant: 'outline',
  },
}

const Button = {
  variants: {
    outline: {
      borderColor: 'interface.orange',
      color: 'interface.orange',
    },
  },
}

export const createTheme = () => {
  return extendTheme({
    active: true,
    colors,
    components: {
      Heading,
      Input,
      Button,
    },
    fonts: {
      heading: 'Mulish',
      body: 'Mulish',
    },
    config: {
      initialColorMode: 'dark',
      useSystemColorMode: false,
    },
  })
}
export const useDefault = createTheme()
