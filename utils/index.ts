import type { TranslationStringType } from './providers/translation'

export const composeToEnJson = (
  translationStrings: TranslationStringType = {
    scopeName: '',
    fullScopeString: '',
    languages: [{ en: [] }],
  },
): string => {
  let enString = `
  {
      
  `

  translationStrings.languages.forEach((language) => {
    const languageKey = Object.keys(language)[0]
    if (languageKey === 'en') {
      language['en'].forEach((translationString) => {
        enString =
          enString +
          `     "${translationString.id}" : "${translationString.defaultValue}",` +
          '\n' +
          '  '
      })
    }
  })

  enString =
    enString +
    `
  }
  `

  return enString
}

export const composeToMessages = (
  scopeName: string,
  translationStrings: TranslationStringType = {
    scopeName: '',
    fullScopeString: '',
    languages: [{ en: [] }],
  },
): string => {
  let enString = `
  import { defineMessages } from 'react-intl'

  export const scope = '${scopeName}'

  export default defineMessages({`

  translationStrings.languages.forEach((language) => {
    const languageKey = Object.keys(language)[0]
    if (languageKey === 'en') {
      language['en'].forEach((translationString) => {
        const justId = translationString.id.split(`${scopeName}.`)[1]
        enString =
          enString +
          `
    ${justId}: {
      id: ${'`${scope}.'}${justId}${'`'},
      defaultMessage: '${translationString.defaultValue}',
    },`
      })
    }
  })

  enString =
    enString +
    `
  })
  `
  return enString
}

export const copyToClipboard = (data: string, successCallback: (args: string) => void): void => {
  if (typeof window === 'undefined') {
    throw new Error('`copyToClipboard` should be used in the browser environment')
  }

  try {
    navigator.clipboard.writeText(data)
    if (successCallback) successCallback(data)
  } catch {
    return
  }
}

export const downloadToFile = (data: string, fileName: string): void => {
  const element = document.createElement('a')
  const file = new Blob([data], { type: 'text/plain' })
  element.href = URL.createObjectURL(file)
  element.download = fileName
  document.body.appendChild(element) // Required for this to work in FireFox
  element.click()
}
