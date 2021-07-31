import * as React from 'react'

interface TranslationStringType {
  scopeName: string
  languages: Array<{ en: Array<{ id: string; defaultValue: string }> }>
}

interface TranslationStringContextType {
  translationStrings: Array<TranslationStringType>
  updateTranslationStrings: (updatedTranslationStrings: TranslationStringType) => void
  addTranslationStrings: (newTranslationString: {
    scopeName: string
    translationString: { id: string; defaultValue: string }
  }) => void
  addNewScope: (newScope: TranslationStringType) => void
  deleteScope: (scopeName: string) => void
}

export const TranslationStringContext = React.createContext<TranslationStringContextType>({
  translationStrings: [],
  updateTranslationStrings: () => undefined,
  addTranslationStrings: () => undefined,
  addNewScope: () => undefined,
  deleteScope: () => undefined,
})

export const useTranslationStrings = (): TranslationStringContextType => {
  const context = React.useContext(TranslationStringContext)

  if (!context) {
    throw new Error(
      'useTranslationStrings cannot be used outside of TranslationStringContext Provider',
    )
  }
  return context
}

export function TranslationStringContextProvider({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  const [translationStrings, setTranslationStrings] = React.useState<Array<TranslationStringType>>([
    // {
    //   scopeName: 'testing',
    //   languages: [
    //     {
    //       en: [
    //         {
    //           id: 'testing',
    //           defaultValue: 'testing the defaultValue rendering',
    //         },
    //       ],
    //     },
    //   ],
    // },
  ])

  const updateTranslationStrings = React.useCallback((strings) => {
    setTranslationStrings(strings)
  }, [])

  const addNewScope = React.useCallback((newTranslationString) => {
    setTranslationStrings((state) => [...state, newTranslationString])
  }, [])

  const addTranslationStrings = React.useCallback(
    (props: { scopeName: string; translationString: { id: string; defaultValue: string } }) => {
      const {
        scopeName,
        translationString: { id = '', defaultValue = '' },
      } = props

      setTranslationStrings((state) => {
        const copiedState = [...state]

        const currentScopeIndex = state.findIndex((scope) => scope.scopeName === scopeName)

        const updatedLanguagesStrings = copiedState[currentScopeIndex].languages.map((language) => {
          const languageKey = Object.keys(language)[0]
          if (languageKey === 'en') {
            return { ['en']: [...language['en'], { id, defaultValue }] }
          }
          return language
        })

        copiedState[currentScopeIndex] = {
          ...copiedState[currentScopeIndex],
          languages: [...updatedLanguagesStrings],
        }

        return [...copiedState]
      })
    },
    [],
  )

  const deleteScope = React.useCallback((scopeName) => {
    setTranslationStrings((state) => {
      return state.filter((translationString) => translationString.scopeName !== scopeName)
    })
  }, [])

  const value = React.useMemo(() => {
    return {
      translationStrings,
      updateTranslationStrings,
      addNewScope,
      addTranslationStrings,
      deleteScope,
    }
  }, [
    addNewScope,
    translationStrings,
    updateTranslationStrings,
    addTranslationStrings,
    deleteScope,
  ])

  return (
    <TranslationStringContext.Provider value={value}>{children}</TranslationStringContext.Provider>
  )
}