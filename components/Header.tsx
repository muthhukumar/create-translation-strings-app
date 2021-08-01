import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Text, Flex, HStack, IconButton } from '@chakra-ui/react'
import { GoMarkGithub } from 'react-icons/go'
import { SiTwitter } from 'react-icons/si'

import { Logo } from '.'
import { ThemeToggle } from '.'

function Header(): JSX.Element {
  const router = useRouter()
  return (
    <Flex p="4" mb="4" borderBottomWidth="1px" color="white.500" justifyContent="space-between">
      <Link href="/">
        <a>
          <HStack>
            <Logo />
            <Text fontSize="2xl">Create Translation strings</Text>
          </HStack>
        </a>
      </Link>
      <HStack>
        <IconButton
          variant="outline"
          aria-label="open twitter"
          icon={<SiTwitter />}
          border="none"
          size="sm"
          onClick={() => router.replace('https://rd.nullish.in/twitter')}
        />
        <IconButton
          variant="outline"
          aria-label="open twitter"
          icon={<GoMarkGithub />}
          border="none"
          size="sm"
          onClick={() => router.replace('https://rd.nullish.in/github')}
        />
        <ThemeToggle />
      </HStack>
    </Flex>
  )
}

export default Header
