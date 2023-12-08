export type SelectableAlphabets = Record<string, SelectableAlphabet>

export type SelectableAlphabet = {
  label: string
  path: string
}

export type CodeWords = Record<string, string>

const BASE_PATH = import.meta.env.BASE_URL
const AVAILABLE_ALPHABETS_PATH = BASE_PATH + "alphabets.json"

const fetchType = async <T>(path: string): Promise<T> => {
  const response = await fetch(location.origin + path)
  const responseData = await response.json()
  return responseData as T
}

export const getSelectableAlphabets = async (): Promise<SelectableAlphabets> => await fetchType(AVAILABLE_ALPHABETS_PATH)

export const getCodeWords = async (selectedAlphabet: SelectableAlphabet): Promise<CodeWords> =>
  await fetchType(BASE_PATH + selectedAlphabet.path)
