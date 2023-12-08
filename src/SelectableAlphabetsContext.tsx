import { createContext, type PropsWithChildren, useEffect, useState } from "react"

import { getSelectableAlphabets, type SelectableAlphabets } from "./Api"

export type SelectableAlphabetsContextType = {
  isLoading: boolean
  selectableAlphabets: SelectableAlphabets
  selectedAlphabetKey: string
  setSelectedAlphabetKey: (selectedAlphabetKey: string) => void
}

export const SelectableAlphabetsContext = createContext<SelectableAlphabetsContextType>({
  isLoading: false,
  selectableAlphabets: {},
  selectedAlphabetKey: "",
  setSelectedAlphabetKey: () => undefined,
})

const NATO_ALPHABET_KEY = "nato"

export const SelectableAlphabetsContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectableAlphabets, setSelectableAlphabets] = useState<SelectableAlphabets>({})
  const [selectedAlphabetKey, setSelectedAlphabetKey] = useState<string>("")

  useEffect(() => {
    setIsLoading(true)
    getSelectableAlphabets()
      .then(
        (alphabets) => {
          setSelectableAlphabets(alphabets)
          if (alphabets[NATO_ALPHABET_KEY] !== undefined) {
            setSelectedAlphabetKey(NATO_ALPHABET_KEY)
          }
        },
        (reason) => {
          console.log(reason)
        },
      )
      .finally(() => setIsLoading(false))
  }, [setSelectableAlphabets, setSelectedAlphabetKey])

  return (
    <SelectableAlphabetsContext.Provider
      value={{
        isLoading,
        selectableAlphabets,
        selectedAlphabetKey,
        setSelectedAlphabetKey,
      }}
    >
      {children}
    </SelectableAlphabetsContext.Provider>
  )
}
