import * as React from 'react'

export function useLocalStorageState<StateType>(
  key: string,
  defaultValue: StateType,
  { serialize = JSON.stringify, deserialize = JSON.parse } = {},
): [StateType, React.Dispatch<React.SetStateAction<StateType>>] {
  const [state, setState] = React.useState<StateType>(() => defaultValue)

  React.useLayoutEffect(() => {
    // This will make sure that this useEffect only happens at browser side not in the client side.
    const getDefaultValue = () => {
      const valueInLocalStorage = window.localStorage.getItem(key)
      if (valueInLocalStorage) {
        try {
          return deserialize(valueInLocalStorage)
        } catch (error) {
          window.localStorage.removeItem(key)
        }
      }
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue
    }
    setState(getDefaultValue())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, state, serialize])

  return [state, setState]
}
