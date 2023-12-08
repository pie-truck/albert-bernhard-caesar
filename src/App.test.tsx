import { fireEvent, render, screen } from "@testing-library/react"
import { rest } from "msw"
import { setupServer } from "msw/node"

import { type SelectableAlphabets } from "./Api"
import App from "./App"

describe("App", () => {
  const selectableAlphabets: SelectableAlphabets = {
    nato: {
      label: "NATO",
      path: "alphabets/nato.json",
    },
    foo: {
      label: "foo",
      path: "alphabets/foo.json",
    },
  }
  const natoCodeWords = { a: "alpha" }
  const fooCodeWords = { a: "foo" }

  const setItem = vi.spyOn(Storage.prototype, "setItem")
  const getItem = vi.spyOn(Storage.prototype, "getItem")

  const server = setupServer(
    rest.get(globalThis.location.origin + "/alphabets.json", async (_, res, ctx) => {
      return await res(ctx.json(selectableAlphabets))
    }),
    rest.get(globalThis.location.origin + "/alphabets/nato.json", async (_, res, ctx) => {
      return await res(ctx.json(natoCodeWords))
    }),
    rest.get(globalThis.location.origin + "/alphabets/foo.json", async (_, res, ctx) => {
      return await res(ctx.json(fooCodeWords))
    }),
  )

  beforeAll(() => {
    server.listen()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it("should show available alphabets", async () => {
    // given
    // when
    render(<App />)
    // then
    const tabs = (await screen.findAllByRole("listitem")).map((listItem) => listItem.textContent)
    expect(tabs).toEqual(Object.values(selectableAlphabets).map((selectableAlphabet) => selectableAlphabet.label))
  })

  it("should show progress bar when alphabets are loading", () => {
    // given
    server.use(rest.get(globalThis.location.origin + "alphabets.json", async (_, res, ctx) => await res(ctx.delay("infinite"))))
    // when
    render(<App />)
    // then
    expect(screen.getByRole("progressbar")).toBeInTheDocument()
  })

  it("should preselect NATO alphabet", async () => {
    // given
    // when
    render(<App />)
    // then
    const nato = (await screen.findByText(selectableAlphabets.nato.label)).parentElement
    expect(nato).toHaveClass("is-active")
  })

  it("should change selected alphabet when option is clicked", async () => {
    // given
    render(<App />)
    const foo = await screen.findByText(selectableAlphabets.foo.label)
    // when
    fireEvent.click(foo)
    // then
    expect(foo.parentElement).toHaveClass("is-active")
  })

  it("should show codewords when text is entered", async () => {
    // given
    render(<App />)
    const inputField = await screen.findByDisplayValue("")
    const input = "aaa"
    // when
    fireEvent.change(inputField, { target: { value: input } })
    // then
    const codeWords = await screen.findAllByText(natoCodeWords.a)
    expect(codeWords).toHaveLength(input.length)
  })

  it("should change codewords when selected alphabet is changed", async () => {
    // given
    render(<App />)
    const inputField = await screen.findByDisplayValue("")
    const input = "aaa"
    fireEvent.change(inputField, { target: { value: input } })
    // when
    // then
    const codeWords = await screen.findAllByText(natoCodeWords.a)
    expect(codeWords).toHaveLength(input.length)
  })

  it("should cache codewords", async () => {
    // given
    render(<App />)
    const foo = await screen.findByText(selectableAlphabets.foo.label)
    fireEvent.click(foo)
    const nato = await screen.findByText(selectableAlphabets.nato.label)
    // when
    fireEvent.click(nato)
    // then
    expect(setItem).toBeCalledWith("alphabet_nato", JSON.stringify(natoCodeWords))
    expect(setItem).toBeCalledWith("alphabet_foo", JSON.stringify(fooCodeWords))
    expect(getItem).toBeCalledWith("alphabet_nato")
  })
})
