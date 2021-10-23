import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { lighten, darken } from 'polished'
import React, { useContext, createContext, useState, FC } from 'react'

import { DaoMetadata } from '../hooks/useDaoMetadata/types'
import { createTheme, DEFAULT_THEME, useDefault } from '../themes/theme'

interface CustomThemeContextProps {
  theme: any
  updateTheme: (daoMetadata?: DaoMetadata) => void
  resetTheme: () => void
}

export const CustomThemeContext = createContext<CustomThemeContextProps>({
  theme: useDefault,
  updateTheme: () => {},
  resetTheme: () => {},
})

export const CustomThemeProvider: FC = ({ children }) => {
  const [theme, setTheme] = useState(useDefault)

  const updateTheme = (daoMetadata?: DaoMetadata) => {
    const daoTheme = {
      fonts: {
        heading:
          daoMetadata?.customThemeConfig?.headingFont ??
          DEFAULT_THEME.fonts.heading,
        body:
          daoMetadata?.customThemeConfig?.bodyFont ?? DEFAULT_THEME.fonts.body,
      },
      colors: {
        interface: {
          base:
            daoMetadata?.customThemeConfig?.primary500 ??
            //@ts-ignore
            DEFAULT_THEME.colors.interface.base,
          dark: darken(
            0.1,
            daoMetadata?.customThemeConfig?.primary500 ??
              //@ts-ignore
              DEFAULT_THEME.colors.interface.base
          ),
          light: lighten(
            0.1,
            daoMetadata?.customThemeConfig?.primary500 ??
              //@ts-ignore
              DEFAULT_THEME.colors.interface.base
          ),
        },
      },
      images: {
        bg: daoMetadata?.customThemeConfig?.bgImg,
        bgOpacity:
          (daoMetadata?.customThemeConfig?.bgOverlayOpacity ?? 0) * 100,
      },
    }

    // @ts-ignore
    const newTheme = createTheme(daoTheme)
    setTheme(newTheme)
  }

  const resetTheme = () => setTheme(useDefault)

  return (
    <CustomThemeContext.Provider
      value={{
        // @ts-ignore
        theme,
        updateTheme,
        resetTheme,
      }}
    >
      <ChakraProvider theme={theme}>
        {children}
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      </ChakraProvider>
    </CustomThemeContext.Provider>
  )
}

export const useCustomTheme = () => {
  const { theme, updateTheme, resetTheme } = useContext(CustomThemeContext)
  return {
    theme,
    updateTheme,
    resetTheme,
  }
}
