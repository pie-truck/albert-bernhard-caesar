import { useContext, useEffect, useState } from "react"

import { type CodeWords, getCodeWords } from "../Api"
import { SelectableAlphabetsContext } from "../SelectableAlphabetsContext"

const localStorageAlphabetPrefix = "alphabet_"

const createLocalStorageKey = (selectableAlphabetKey: string): string => localStorageAlphabetPrefix + selectableAlphabetKey

const getCodeWordsFromLocalStorageIfExist = (selectedAlphabetKey: string): CodeWords | undefined => {
  let codeWords: CodeWords | undefined
  const codeWordsJson = localStorage.getItem(createLocalStorageKey(selectedAlphabetKey))
  if (codeWordsJson !== null) {
    try {
      codeWords = JSON.parse(codeWordsJson)
    } catch {
      localStorage.removeItem(createLocalStorageKey(selectedAlphabetKey))
    }
  }
  return codeWords
}

export const Spelling: React.FC = () => {
  const { selectedAlphabetKey, selectableAlphabets } = useContext(SelectableAlphabetsContext)

  const [lettersToSpell, setLettersToSpell] = useState<string[]>([])
  const [codeWords, setCodeWords] = useState<CodeWords>({})

  useEffect(() => {
    const selectedAlphabet = selectableAlphabets[selectedAlphabetKey]
    if (selectedAlphabet !== undefined) {
      const codeWords = getCodeWordsFromLocalStorageIfExist(selectedAlphabetKey)
      if (codeWords === undefined) {
        getCodeWords(selectedAlphabet).then(
          (cw) => {
            localStorage.setItem(createLocalStorageKey(selectedAlphabetKey), JSON.stringify(cw))
            setCodeWords(cw)
          },
          (error) => {
            console.log(error)
          },
        )
      } else {
        setCodeWords(codeWords)
      }
    }
  }, [selectedAlphabetKey, selectableAlphabets])

  const onLettersChange: (letters: string) => void = (letters) => setLettersToSpell(letters.toLowerCase().split(""))

  return (
    <>
      <div className="block">
        <input className="input is-primary" onChange={(e) => onLettersChange(e.target.value)} />
      </div>
      <div className="block">
        {lettersToSpell.map((letter, i) => (
          <p key={`representation#${i}`} className="representation">
            {codeWords[letter] ?? letter}
          </p>
        ))}
      </div>
    </>
  )
}
