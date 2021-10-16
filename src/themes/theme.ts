import { extendTheme, Colors } from '@chakra-ui/react'
import { StyleConfig } from '@chakra-ui/theme-tools'
import { merge } from 'lodash'

const Heading: StyleConfig = {
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

const Input: StyleConfig = {
  variants: {
    outline: {
      field: {
        borderColor: 'white',
        bg: 'transparent',
        _hover: {
          borderColor: 'interface.orange.base',
        },
        _focus: {
          borderColor: 'interface.orange.base',
        },
      },
    },
  },
  defaultProps: {
    variant: 'outline',
    // @ts-ignore
    focusBorderColor: 'interface.orange.base',
  },
}

const Button: StyleConfig = {
  variants: {
    solid: {
      color: 'white',
      bg: 'interface.orange.base',
      _hover: {
        bg: 'interface.orange.dark',
      },
    },
    outline: {
      borderColor: 'interface.orange.base',
      color: 'interface.orange.base',
      _hover: {
        borderColor: 'interface.orange.dark',
        color: 'interface.orange.dark',
        bg: 'transparent',
      },
    },
  },
}

export interface DAOTheme {
  fonts: { heading?: string; body?: string }
  colors: Colors
  images: {
    bg?: string
    bgOpacity?: number
  }
}

export const DEFAULT_THEME: DAOTheme = {
  fonts: {
    heading: 'Mulish',
    body: 'Mulish',
  },
  colors: {
    borderColor: 'rgba(255, 255, 255, 0.2)',
    brand: {
      darkBlue1: '#050A1B',
      darkBlue2: '#0E1235',
    },
    interface: {
      orange: {
        base: '#ED963A',
        dark: '#CA7D2C',
        light: '#F3AC61',
      },
    },
  },
  images: {
    bg: '',
  },
}

const Link = {
  baseStyle: {
    color: 'interface.orange.base',
    _hover: {
      color: 'interface.orange.dark',
    },
  },
}

export const createTheme = (daoTheme?: DAOTheme) => {
  const mergedTheme = merge(DEFAULT_THEME, daoTheme ?? {})

  return extendTheme({
    active: true,
    components: {
      Heading,
      Input,
      Button,
      Link,
    },
    ...mergedTheme,
    config: {
      initialColorMode: 'dark',
      useSystemColorMode: false,
    },
  })
}
export const useDefault = createTheme()
