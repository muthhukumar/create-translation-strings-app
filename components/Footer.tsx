import * as React from 'react'
import { Flex, Text, VStack } from '@chakra-ui/react'

function Footer(): JSX.Element {
  return (
    <Flex p="4" borderTopWidth="1px" borderColor="white.500" justifyContent="center">
      <VStack>
        <Text>Made in love with ♥️ Chakra-UI and NextJs</Text>
        <Text>Made by Muthukumar</Text>
      </VStack>
    </Flex>
  )
}

export default Footer
