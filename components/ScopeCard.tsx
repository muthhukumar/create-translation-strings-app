import * as React from 'react'
import Link from 'next/link'
import {
  Text,
  Flex,
  VStack,
  HStack,
  Button,
  Spacer,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { HiClipboardList, HiDownload } from 'react-icons/hi'
import { copyToClipboard, composeToEnJson, composeToMessages, downloadToFile } from '../utils'
import type { TranslationStringType } from '../utils/providers/translation'

interface Props {
  scopeName: string
  noOfEnEntries: number
  fullScopeString: string
  data: TranslationStringType
}

function ScopeCard(props: Props): JSX.Element {
  const { scopeName, noOfEnEntries, fullScopeString, data } = props

  const moon = useColorModeValue('black', 'white')
  const moonInvert = useColorModeValue('white', 'black')
  const toast = useToast()

  const handleCopyToEnJson = () => {
    copyToClipboard(composeToEnJson(data), () => {
      toast({
        title: 'Copied to en.json format successfully',
        status: 'success',
      })
    })
  }

  const handleCopyToMessage = () => {
    copyToClipboard(composeToMessages(fullScopeString, data), () => {
      toast({
        title: 'Copied to messages.js format successfully',
        status: 'success',
      })
    })
  }

  const handleDownloadToEnJson = () => {
    const enJsonData = composeToEnJson(data)

    downloadToFile(enJsonData, 'en.json')
  }

  const handleDownloadToMessagesJs = () => {
    const messagesData = composeToMessages(fullScopeString, data)

    downloadToFile(messagesData, 'messages.js')
  }

  return (
    <Flex borderWidth="1px" borderColor="white.500" p="4" rounded="md" m="2">
      <VStack alignItems="flex-start">
        <HStack
          justifyContent="space-between"
          w="100%"
          mb="2"
          borderBottomWidth="1px"
          borderColor="color.white"
          pb="4"
        >
          <Link href={`/${scopeName}`}>
            <a>
              <Text
                _hover={{
                  textDecoration: 'underline',
                }}
                fontSize="lg"
              >
                {scopeName}
              </Text>
            </a>
          </Link>
          <Flex
            bg={moon}
            w="25px"
            h="25px"
            rounded="full"
            alignItems="center"
            justifyContent="center"
          >
            <Text color={moonInvert}>{noOfEnEntries}</Text>
          </Flex>
        </HStack>
        <HStack>
          <Text px="2" bg={moon} rounded="md" color={moonInvert}>
            Scope:
          </Text>
          <Text>{fullScopeString}</Text>
        </HStack>
        <Spacer h="30px" />
        <HStack pt="2">
          <Button rightIcon={<HiClipboardList />} w="100%" size="md" onClick={handleCopyToEnJson}>
            en.json
          </Button>
          <Button rightIcon={<HiClipboardList />} w="100%" size="md" onClick={handleCopyToMessage}>
            messages.js
          </Button>
        </HStack>
        <HStack>
          <Button rightIcon={<HiDownload />} w="100%" size="md" onClick={handleDownloadToEnJson}>
            en.json
          </Button>
          <Button
            rightIcon={<HiDownload />}
            w="100%"
            size="md"
            onClick={handleDownloadToMessagesJs}
          >
            messages.js
          </Button>
        </HStack>
      </VStack>
    </Flex>
  )
}

export default ScopeCard
