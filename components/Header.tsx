import * as React from 'react'
import { Text, Flex, HStack } from '@chakra-ui/react'

import { Logo } from '.'

function Header(): JSX.Element {
  return (
    <Flex p="4" mb="4" borderBottomWidth="1px" color="white.500">
      <HStack>
        <Logo />
        <Text fontSize="2xl">Create Translation strings</Text>
      </HStack>
    </Flex>
  )
}

export default Header
