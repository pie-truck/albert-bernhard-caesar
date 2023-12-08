import "bulma/css/bulma.min.css"

import { AlphabetSelection } from "./components/AlphabetSelection"
import { Spelling } from "./components/Spelling"
import { SelectableAlphabetsContextProvider } from "./SelectableAlphabetsContext"

const App: React.FC = () => {
  return (
    <div className="columns">
      <div className="box column is-half is-offset-one-quarter is-10-mobile is-offset-1-mobile">
        <SelectableAlphabetsContextProvider>
          <AlphabetSelection />
          <Spelling />
        </SelectableAlphabetsContextProvider>
      </div>
    </div>
  )
}

export default App
