import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Text,
  Input,
  VStack,
  HStack,
  IconButton,
  useToast,
  chakra,
  Modal,
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react'
import { IoMdAdd } from 'react-icons/io'
import { MdDeleteForever } from 'react-icons/md'

import { useTranslationStrings } from '../utils/providers/translation'

function SideBar(): JSX.Element {
  const { translationStrings = [], addNewScope, deleteScope } = useTranslationStrings()
  const [scope, setScope] = React.useState('')

  const { onClose, onOpen, isOpen } = useDisclosure()
  const toast = useToast()
  const { scope: mainScope = '' } = useRouter().query
  const color = useColorModeValue('black', 'white')

  const deleteScopeRef = React.useRef('')

  const handleAddNewScope = (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (!scope) {
      return
    }

    const isExistingScope = translationStrings.some(({ scopeName }) => scopeName === scope)

    if (isExistingScope) {
      return toast({
        title: 'Scope name should be unique',
        status: 'error',
      })
    }

    addNewScope({ scopeName: scope, fullScopeString: '', languages: [{ en: [] }] })

    setScope('')
  }

  const handleDeleteScope = () => {
    if (!deleteScopeRef.current) {
      return
    }

    deleteScope(deleteScopeRef.current)

    onClose()

    toast({
      title: `Deleted '${deleteScopeRef.current}' scope successfully.`,
      status: 'success',
    })

    deleteScopeRef.current = ''
  }

  return (
    <VStack
      alignItems="flex-start"
      m="4"
      mt="0"
      p="4"
      borderWidth="1px"
      borderColor="white.500"
      minH="89vh"
      rounded="lg"
      minW="xs"
    >
      <Text fontSize="xl" mb="1">
        Scopes
      </Text>
      <chakra.form onSubmit={handleAddNewScope} pb="4" w="100%">
        <HStack w="100%">
          <Input
            placeholder="Enter scope..."
            value={scope}
            onChange={(e) => setScope(e.target.value.trim())}
            w="100%"
          />
          <IconButton aria-label="Add new scope" icon={<IoMdAdd />} type="submit" />
        </HStack>
      </chakra.form>
      <VStack alignItems="flex-start" w="100%">
        {translationStrings.length > 0 ? (
          translationStrings.map((translationString, index) => (
            <HStack
              key={translationString.scopeName}
              justifyContent="space-between"
              w="100%"
              p="1"
              rounded="md"
              bg={mainScope === translationString.scopeName ? 'cyan.900' : undefined}
            >
              <Link href={`/${translationString.scopeName}`}>
                <a>
                  <Text pl="2" color={mainScope === translationString.scopeName ? 'white' : color}>
                    {index + 1}. {translationString.scopeName}
                  </Text>
                </a>
              </Link>
              <IconButton
                aria-label="Delete the scope"
                size="xs"
                icon={<MdDeleteForever size="20" />}
                marginLeft="auto"
                onClick={() => {
                  onOpen()
                  deleteScopeRef.current = translationString.scopeName
                }}
              />
            </HStack>
          ))
        ) : (
          <Text textAlign="center">No Scope found...</Text>
        )}
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Scope</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            This action is not reversible. All the translation strings relate to the{' '}
            {`'${deleteScopeRef.current}'`} scope will get deleted. Are you sure to continue?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteScope}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  )
}

export default SideBar
