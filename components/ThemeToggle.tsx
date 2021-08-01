import * as React from 'react'
import { useColorMode, IconButton } from '@chakra-ui/react'
import { FaSun } from 'react-icons/fa'
import { RiMoonFill } from 'react-icons/ri'

function ThemeToggle(): JSX.Element {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  const bg = { dark: '#fafafa', light: 'black' }

  return isDark ? (
    <IconButton
      variant="outline"
      color={bg[colorMode]}
      aria-label="switch to light theme"
      icon={<FaSun />}
      onClick={toggleColorMode}
      border="none"
      size="sm"
    />
  ) : (
    <IconButton
      size="sm"
      variant="outline"
      color={bg[colorMode]}
      colorScheme="telegram"
      aria-label="switch to light theme"
      icon={<RiMoonFill />}
      onClick={toggleColorMode}
      border="none"
    />
  )
}

export default ThemeToggle
