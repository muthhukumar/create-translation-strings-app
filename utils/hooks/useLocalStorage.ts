import * as React from 'react'

export function useLocalStorageState<StateType>(
  key: string,
  defaultValue: string | (() => void) = '',
  { serialize = JSON.stringify, deserialize = JSON.parse } = {},
): [StateType, React.Dispatch<React.SetStateAction<StateType>>] {
  const [state, setState] = React.useState<StateType>(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      // the try/catch is here in case the localStorage value was set before
      // we had the serialization in place
      try {
        return deserialize(valueInLocalStorage)
      } catch (error) {
        window.localStorage.removeItem(key)
      }
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, state, serialize])

  // const removeItem = () => {
  //   try {
  //     localStorage.removeItem(key)
  //   } catch {}
  // }

  return [state, setState]
}
