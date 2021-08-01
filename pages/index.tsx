import React from 'react'
import { Text, Flex } from '@chakra-ui/react'
import { NextSeo } from 'next-seo'

import { Page } from '../components'
import { useTranslationStrings } from '../utils/providers/translation'

import ScopeCard from '../components/ScopeCard'

function Home(): JSX.Element {
  const { translationStrings } = useTranslationStrings()
  return (
    <Page>
      <NextSeo
        title="Home | CTS "
        description="An online tool to generate translation strings easily. From this tool you can download translation strings you created and you can also copy to clipboard"
      />
      <Flex maxW="100%" flexWrap="wrap" justifyContent="flex-start">
        {translationStrings && translationStrings.length > 0 ? (
          translationStrings.map((translationString) => {
            return (
              <ScopeCard
                key={translationString.scopeName}
                scopeName={translationString.scopeName}
                noOfEnEntries={translationString.languages[0].en.length}
                fullScopeString={translationString.fullScopeString}
                data={translationString}
              />
            )
          })
        ) : (
          <Text>Select a scope or create one to start adding translation strings</Text>
        )}
      </Flex>
    </Page>
  )
}

export default Home
