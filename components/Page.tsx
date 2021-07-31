import React from 'react'
import { chakra, HStack } from '@chakra-ui/react'

import { Sidebar, Footer, Header } from '.'

interface Props {
  children: React.ReactNode
}

function Page(props: Props): JSX.Element {
  return (
    <>
      <Header />
      <chakra.main>
        <HStack alignItems="flex-start" minH="100vh">
          <Sidebar />
          {props.children}
        </HStack>
      </chakra.main>
      <Footer />
    </>
  )
}

export default Page
