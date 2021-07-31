import React from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  chakra,
  Divider,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react'

import { Page } from '../components'
import { useTranslationStrings } from '../utils/providers/translation'
import { HiClipboardList } from 'react-icons/hi'

function ScopeTranslationStrings(): JSX.Element {
  const [fullScope, setFullScope] = React.useState<string>('')
  const [id, setId] = React.useState('')
  const [defaultValue, setDefaultValue] = React.useState('')

  const [isIdInvalid, setIsIdInvalid] = React.useState<boolean>(false)
  const [isDefaultValueInvalid, setIsDefaultValueInvalid] = React.useState<boolean>(false)
  const [isFullScopeInvalid, setIsFullScopeInvalid] = React.useState<boolean>(false)

  const { scope = '' } = useRouter().query
  const { translationStrings = [], addTranslationStrings } = useTranslationStrings()
  const toast = useToast()
  const router = useRouter()

  const filteredTranslationStrings = React.useMemo(
    () =>
      translationStrings.filter((translationString) => translationString.scopeName === scope) ?? [],
    [scope, translationStrings],
  )

  React.useEffect(() => {
    setFullScope('')
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

    setFullScope(currentFullScope)
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

    const scopeName = typeof scope === 'string' ? scope : ''

    const fullId = fullScope + id

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

  return (
    <Page>
      <Box flex="1">
        <Heading as="h2" fontSize="4xl" mb="4" color="skyblue">
          {scope}
        </Heading>
        <InputGroup size="md" w="50%" mb="8">
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
        <Text mb="2" fontSize="lg">
          Copy to clipboard
        </Text>
        <HStack>
          <Button rightIcon={<HiClipboardList />}>en.json</Button>
          <Button rightIcon={<HiClipboardList />}>messages.js</Button>
        </HStack>
        <Divider mt="8" />
        <VStack mt="8" alignItems="flex-start">
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
                      <Text key={languageString?.id}>
                        {`"${languageString?.id}" : "${languageString?.defaultValue}"`}
                      </Text>
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
      </Box>
    </Page>
  )
}

export default ScopeTranslationStrings
