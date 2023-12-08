import * as fs from "fs"

import { SelectableAlphabets } from "./Api"

describe("alphabets.json", () => {
  it("should reference existing alphabtes", () => {
    // given
    const fileContent = fs.readFileSync("public/alphabets.json").toString()
    // when
    const alphabets = JSON.parse(fileContent) as SelectableAlphabets
    // then
    Object.values(alphabets).forEach((selectableAlphabet) => {
      expect(fs.existsSync(`public/${selectableAlphabet.path}`)).toBeTruthy()
    })
  })
})
