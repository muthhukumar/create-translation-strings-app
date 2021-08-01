import _ from 'lodash'
import * as React from 'react'
import { useLocalStorageState } from '../hooks/useLocalStorage'

export interface TranslationStringType {
  scopeName: string
  fullScopeString: string
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
  deleteTranslationString: (scopeName: string, translationStringId: string) => void
  setFullScopeString: (scopeName: string, fullScopeString: string) => void
}

export const TranslationStringContext = React.createContext<TranslationStringContextType>({
  translationStrings: [],
  updateTranslationStrings: () => undefined,
  addTranslationStrings: () => undefined,
  addNewScope: () => undefined,
  deleteScope: () => undefined,
  deleteTranslationString: () => undefined,
  setFullScopeString: () => undefined,
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
  const [translationStrings, setTranslationStrings] = useLocalStorageState<
    Array<TranslationStringType>
  >('TranslationStrings', [])

  const updateTranslationStrings = React.useCallback(
    (strings) => {
      setTranslationStrings(strings)
    },
    [setTranslationStrings],
  )

  const addNewScope = React.useCallback(
    (newTranslationString) => {
      setTranslationStrings((state) => [...state, newTranslationString])
    },
    [setTranslationStrings],
  )

  const addTranslationStrings = React.useCallback(
    (props: { scopeName: string; translationString: { id: string; defaultValue: string } }) => {
      const {
        scopeName,
        translationString: { id = '', defaultValue = '' },
      } = props

      setTranslationStrings((state) => {
        const copiedState = _.cloneDeep(state)

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
    [setTranslationStrings],
  )

  const deleteScope = React.useCallback(
    (scopeName) => {
      setTranslationStrings((state) => {
        return state.filter((translationString) => translationString.scopeName !== scopeName)
      })
    },
    [setTranslationStrings],
  )

  const setFullScopeString = React.useCallback(
    (scopeName, fullScopeString) => {
      setTranslationStrings((state) => {
        return state.map((translationString) => {
          if (translationString.scopeName === scopeName) {
            return {
              ...translationString,
              fullScopeString,
            }
          }
          return translationString
        })
      })
    },
    [setTranslationStrings],
  )

  const deleteTranslationString = React.useCallback(
    (scopeName, translationStringId) => {
      setTranslationStrings((state) => {
        const copiedState = _.cloneDeep(state)

        const currentScopeIndex = state.findIndex((scope) => scope.scopeName === scopeName)

        const updatedLanguagesStrings = copiedState[currentScopeIndex].languages.map((language) => {
          const languageKey = Object.keys(language)[0]
          if (languageKey === 'en') {
            return {
              ['en']: [
                ...language['en'].filter(
                  (translationString) => translationString.id !== translationStringId,
                ),
              ],
            }
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
    [setTranslationStrings],
  )

  const value = React.useMemo(() => {
    return {
      translationStrings,
      updateTranslationStrings,
      addNewScope,
      addTranslationStrings,
      deleteScope,
      deleteTranslationString,
      setFullScopeString,
    }
  }, [
    translationStrings,
    updateTranslationStrings,
    addNewScope,
    addTranslationStrings,
    deleteScope,
    setFullScopeString,
    deleteTranslationString,
  ])

  return (
    <TranslationStringContext.Provider value={value}>{children}</TranslationStringContext.Provider>
  )
}
