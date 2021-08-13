import React, { useState } from 'react'
import 'antd/dist/antd.css'
import { Input, Tooltip, Button, Empty, Card } from 'antd'
import { getPokemon } from './services/pokemon'
import { CopyToClipboard } from 'react-copy-to-clipboard'

let App = () => {
  const buildRegexFromHint = (hint) => {
    let regexClouse = hint
      .toLowerCase()
      .split('')
      .map((c) => (c == '_' ? '\\w' : c))
      .join('')

    try {
      let regex = new RegExp(regexClouse)
      return { hint, regex }
    } catch (e) {
      setError('Invalid Hint')
      console.error(e)
    }
  }

  const [resultList, setResultList] = useState([])
  const [hint, setHint] = useState('')
  const [prefix, setPrefix] = useState('')
  const [error, setError] = useState(null)

  const queryPokemon = ({ hint, regex }) => {
    let resultList = getPokemon().filter((el) => {
      return el.name.length == hint.length && el.name.match(regex)
    })
    setResultList(resultList)
  }

  const hintSearch = (hint) => {
    setError(null)
    queryPokemon(buildRegexFromHint(hint))
  }

  const renderContent = () => {
    return (
      <div>
        {resultList.length ? (
          resultList.map((item) => {
            let copyText = prefix ? prefix + ' ' + item.name : item.name
            return (
              <div>
                <CopyToClipboard key={item.name} text={copyText}>
                  <Tooltip
                    title={
                      <div className="flex justify-center flex-col ">
                        <img
                          className="h-auto"
                          alt={item.name}
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.url
                            .split('/')
                            .slice(-2, -1)}.png`}
                        />
                      </div>
                    }
                  >
                    <Button>{copyText} </Button>
                  </Tooltip>
                </CopyToClipboard>
              </div>
            )
          })
        ) : (
          <Empty />
        )}
      </div>
    )
  }

  return (
    <div className="flex justify-center align-items m-4">
      <div className="flex justify-center items-center flex-col">
        <div className="flex font-bold text-4xl">PokeTwo Decypher</div>
        <div className="flex flex-row m-1">
          <Input
            placeholder="Prefix"
            onChange={(e) => {
              setPrefix(e.target.value)
            }}
            bordered={false}
          />

          <Input.Search
            placeholder="pokemon hint "
            onSearch={hintSearch}
            bordered={false}
            allowClear
          />
        </div>

        {error ? <p> 😔 {error}</p> : renderContent()}
      </div>
    </div>
  )
}

export default App
