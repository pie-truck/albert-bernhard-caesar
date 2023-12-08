import { useContext } from "react"

import { SelectableAlphabetsContext, type SelectableAlphabetsContextType } from "../SelectableAlphabetsContext"

type SelectableCodeWordProps = {
  codeWordKey: string
  codeWordLabel: string
  selected: boolean
  setSelectedAlphabetKey: SelectableAlphabetsContextType["setSelectedAlphabetKey"]
}

const SelectableAlphabet: React.FC<SelectableCodeWordProps> = ({ codeWordKey, codeWordLabel, selected, setSelectedAlphabetKey }) => {
  const onClick: React.MouseEventHandler = () => {
    setSelectedAlphabetKey(codeWordKey)
  }
  const className = selected ? "is-active" : undefined
  return (
    <li className={className}>
      <a onClick={onClick}>{codeWordLabel}</a>
    </li>
  )
}

export const AlphabetSelection: React.FC = () => {
  const { selectedAlphabetKey, setSelectedAlphabetKey, selectableAlphabets, isLoading } = useContext(SelectableAlphabetsContext)
  const tabs = Object.entries(selectableAlphabets)
    .map<[string, string]>(([alphabetKey, selectableAlphabet]) => [alphabetKey, selectableAlphabet.label])
    .sort(compareObjectEntriesByValue)
    .map(([codeWordKey, codeWordLabel], i) => {
      const selected = codeWordKey === selectedAlphabetKey
      return (
        <SelectableAlphabet
          key={i}
          codeWordKey={codeWordKey}
          codeWordLabel={codeWordLabel}
          setSelectedAlphabetKey={setSelectedAlphabetKey}
          selected={selected}
        />
      )
    })

  return <div className="tabs">{isLoading ? <progress className="progress is-small is-primary" max="100" /> : <ul>{tabs}</ul>}</div>
}

function compareObjectEntriesByValue(a: [string, string], b: [string, string]): number {
  const aValue = a[1]
  const bValue = b[1]
  if (aValue < bValue) {
    return -1
  }
  if (aValue < bValue) {
    return 1
  }
  return 0
}
