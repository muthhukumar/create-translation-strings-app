import React from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  chakra,
  Code,
  Divider,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  StackDivider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { HiDownload } from 'react-icons/hi'
import { NextSeo } from 'next-seo'

import { Page } from '../components'
import { useTranslationStrings } from '../utils/providers/translation'
import { HiClipboardList } from 'react-icons/hi'
import { MdDeleteForever } from 'react-icons/md'
import { composeToEnJson, composeToMessages, downloadToFile } from '../utils'
import { copyToClipboard } from '../utils/index'

function ScopeTranslationStrings(): JSX.Element | null {
  const [id, setId] = React.useState<string>('')
  const [defaultValue, setDefaultValue] = React.useState<string>('')
  const { onClose, onOpen, isOpen } = useDisclosure()
  const deleteTranslationStringRef = React.useRef('')

  const [isIdInvalid, setIsIdInvalid] = React.useState<boolean>(false)
  const [isDefaultValueInvalid, setIsDefaultValueInvalid] = React.useState<boolean>(false)
  const [isFullScopeInvalid, setIsFullScopeInvalid] = React.useState<boolean>(false)

  const { scope = '' } = useRouter().query
  const scopeName = typeof scope === 'string' ? scope : ''

  const {
    translationStrings = [],
    addTranslationStrings,
    deleteTranslationString,
    setFullScopeString,
  } = useTranslationStrings()
  const toast = useToast()
  const router = useRouter()

  const filteredTranslationStrings = React.useMemo(
    () =>
      translationStrings.filter((translationString) => translationString.scopeName === scope) ?? [],
    [scope, translationStrings],
  )

  const fullScope = filteredTranslationStrings[0]?.fullScopeString ?? ''

  React.useEffect(() => {
    // When navigating to different scope some of the state persist for some reason. So when navigating
    // to new scope this will reset the local state
    setId('')
    setDefaultValue('')
  }, [scope])

  React.useEffect(() => {
    if (filteredTranslationStrings.length === 0) {
      router.replace('/')
    }
  }, [filteredTranslationStrings, router])

  const handleIdOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentId = e.target.value.trim()

    if (isIdInvalid && currentId) {
      setIsIdInvalid(false)
    }
    setId(currentId)
  }

  const handleDefaultValueOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentDefaultValue = e.target.value

    if (isDefaultValueInvalid && currentDefaultValue) {
      setIsDefaultValueInvalid(false)
    }

    setDefaultValue(currentDefaultValue)
  }

  const handleFullScopeOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentFullScope = e.target.value

    if (isFullScopeInvalid && currentFullScope) {
      setIsFullScopeInvalid(false)
    }

    if (typeof scope === 'string') {
      setFullScopeString(scope, currentFullScope)
    }
  }

  const handleAddNewTranslationString = (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (!id) {
      setIsIdInvalid(true)
    }
    if (!defaultValue) {
      setIsDefaultValueInvalid(true)
    }

    if (!fullScope) {
      setIsFullScopeInvalid(true)
    }

    if (![id, defaultValue, fullScope].every(Boolean)) {
      return
    }

    setIsIdInvalid(false)
    setIsDefaultValueInvalid(false)

    const fullId = `${fullScope}.${id}`

    const isExistingId = translationStrings.some((translationString) =>
      translationString.languages.some((language) =>
        language['en'].some((eachString) => eachString.id === fullId),
      ),
    )

    if (isExistingId) {
      toast({
        title: 'Entered Id already exists. Id should be unique for each entry.',
        status: 'error',
      })
      return
    }

    addTranslationStrings({ scopeName, translationString: { id: fullId, defaultValue } })

    setId('')
    setDefaultValue('')
  }

  const handleDeleteTranslationString = () => {
    if (!deleteTranslationStringRef.current) {
      return
    }

    deleteTranslationString(scopeName, deleteTranslationStringRef.current)

    toast({ title: 'Deleted translationString successfully', status: 'success' })

    deleteTranslationStringRef.current = ''

    onClose()
  }

  const handleCopyToEnJson = () => {
    copyToClipboard(composeToEnJson(filteredTranslationStrings[0]), () => {
      toast({
        title: 'Copied to en.json format successfully',
        status: 'success',
      })
    })
  }

  const handleCopyToMessage = () => {
    copyToClipboard(composeToMessages(fullScope, filteredTranslationStrings[0]), () => {
      toast({
        title: 'Copied to messages.js format successfully',
        status: 'success',
      })
    })
  }

  const handleDownloadToEnJson = () => {
    const enJsonData = composeToEnJson(filteredTranslationStrings[0])

    downloadToFile(enJsonData, 'en.json')
  }

  const handleDownloadToMessagesJs = () => {
    const messagesData = composeToMessages(fullScope, filteredTranslationStrings[0])

    downloadToFile(messagesData, 'messages.js')
  }

  return (
    <Page>
      <NextSeo title={`${scope} | CTS`} />
      <Box flex="1" pr="4" pb="4">
        <Heading as="h2" fontSize="3xl" mb="8" color="skyblue">
          {scope}
        </Heading>
        <InputGroup size="md" w="40%" mb="8">
          <InputLeftAddon>Full scope string</InputLeftAddon>
          <Input
            errorBorderColor="crimson"
            type="text"
            placeholder="scope..."
            value={fullScope}
            onChange={handleFullScopeOnChange}
            isInvalid={isFullScopeInvalid}
          />
        </InputGroup>
        <HStack alignItems="flex-start" divider={<StackDivider borderColor="white.500" />}>
          <Box>
            <Text mb="2" fontSize="lg">
              Copy to clipboard
            </Text>
            <HStack>
              <Button rightIcon={<HiClipboardList />} onClick={handleCopyToEnJson}>
                en.json
              </Button>
              <Button rightIcon={<HiClipboardList />} onClick={handleCopyToMessage}>
                messages.js
              </Button>
            </HStack>
          </Box>
          <Box ml="2">
            <Text mb="2" fontSize="lg">
              Download to file
            </Text>
            <HStack>
              <Button rightIcon={<HiDownload />} onClick={handleDownloadToEnJson}>
                en.json
              </Button>
              <Button rightIcon={<HiDownload />} onClick={handleDownloadToMessagesJs}>
                messages.js
              </Button>
            </HStack>
          </Box>
        </HStack>

        <Divider mt="8" />
        <Tabs mt="4" isLazy>
          <TabList>
            <Tab>Add translate strings</Tab>
            <Tab>Output</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <VStack alignItems="flex-start">
                <Text fontSize="xl" textDecoration="underline">
                  Translation strings
                </Text>
                {filteredTranslationStrings.map((translationString) => {
                  return translationString.languages.map((language) => {
                    const languageStrings = language['en']
                    return (
                      <>
                        <Text fontSize="lg">en {`{`}</Text>
                        <VStack key="en" alignItems="flex-start" pl="4">
                          {languageStrings.map((languageString) => (
                            <HStack key={languageString?.id}>
                              <Text>{`"${languageString?.id}" : "${languageString?.defaultValue}"`}</Text>
                              <IconButton
                                aria-label="Delete the scope"
                                size="xs"
                                icon={<MdDeleteForever size="20" />}
                                marginLeft="auto"
                                onClick={() => {
                                  onOpen()
                                  deleteTranslationStringRef.current = languageString?.id
                                }}
                              />
                            </HStack>
                          ))}
                        </VStack>
                        <Text fontSize="lg">{`}`}</Text>
                      </>
                    )
                  })
                })}
              </VStack>
              <chakra.form mt="4" maxW="container.lg" onSubmit={handleAddNewTranslationString}>
                <HStack>
                  <Text fontSize="lg" fontWeight="bold" mb="2" textDecoration="underline">
                    {fullScope}
                  </Text>
                  <Input
                    placeholder="id..."
                    maxW="25%"
                    type="text"
                    errorBorderColor="crimson"
                    isInvalid={isIdInvalid}
                    value={id}
                    onChange={handleIdOnChange}
                  />
                  <Input
                    placeholder="default value..."
                    type="text"
                    errorBorderColor="crimson"
                    isInvalid={isDefaultValueInvalid}
                    value={defaultValue}
                    onChange={handleDefaultValueOnChange}
                  />
                  <Button size="md" type="submit">
                    Add
                  </Button>
                </HStack>
              </chakra.form>
            </TabPanel>
            <TabPanel>
              <Tabs variant="soft-rounded">
                <TabList>
                  <Tab>en.json</Tab>
                  <Tab>messages.js</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <Code w="100%">
                      <pre>{composeToEnJson(filteredTranslationStrings[0])}</pre>
                    </Code>
                  </TabPanel>
                  <TabPanel>
                    <Code w="100%">
                      <pre>{composeToMessages(fullScope, filteredTranslationStrings[0])}</pre>
                    </Code>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Scope</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure to delete this string?</ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteTranslationString}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Page>
  )
}

export default ScopeTranslationStrings
