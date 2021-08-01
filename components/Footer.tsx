import * as React from 'react'
import { Divider, Flex, HStack, IconButton, Text, VStack } from '@chakra-ui/react'
import { AiOutlineCopyrightCircle } from 'react-icons/ai'

import { Logo } from '.'
import router from 'next/router'
import { GoMarkGithub } from 'react-icons/go'
import { SiTwitter } from 'react-icons/si'
import ThemeToggle from './ThemeToggle'

function Footer(): JSX.Element {
  return (
    <Flex
      p="4"
      py="6"
      borderTopWidth="1px"
      borderColor="white.500"
      justifyContent="center"
      bg="grey.900"
    >
      <Flex minW="container.lg">
        <VStack alignItems="flex-start" w="100%">
          <HStack>
            <Logo />
            <Text>Create Translation strings</Text>
          </HStack>
          <HStack w="100%" justifyContent="space-between">
            <HStack>
              <Text fontSize="md" fontWeight="light">
                Copyright
              </Text>
              <AiOutlineCopyrightCircle />
              <Text fontSize="md" fontWeight="light">
                2021 Muthukumar. All rights reserved.
              </Text>
            </HStack>
            <HStack>
              <IconButton
                variant="outline"
                aria-label="open twitter"
                icon={<SiTwitter />}
                border="none"
                size="sm"
                onClick={() => router.replace('https://rd.nullish.in/twitter')}
              />
              <Divider orientation="vertical" h="50%" />
              <IconButton
                variant="outline"
                aria-label="open github"
                icon={<GoMarkGithub />}
                border="none"
                size="sm"
                onClick={() =>
                  router.replace('https://github.com/muthhukumar/create-translation-strings-app')
                }
              />
              <ThemeToggle />
            </HStack>
          </HStack>
        </VStack>
      </Flex>
    </Flex>
  )
}

export default Footer
