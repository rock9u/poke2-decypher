import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Input, Tooltip, Button, Empty } from 'antd';
import { getPokemon } from './services/pokemon';
import { CopyToClipboard } from 'react-copy-to-clipboard';

let App = () => {
  const buildRegexFromHint = (hint) => {
    let ret = hint
      .toLowerCase()
      .split('')
      .map((c) => (c == '_' ? '\\w' : c))
      .join('');

    console.log(ret);
    try {
      return new RegExp(ret);
    } catch (e) {
      setError('Invalid Hint');
      console.error(e);
    }
  };

  const [resultList, setResultList] = useState([]);
  const [hint, setHint] = useState('');
  const [prefix, setPrefix] = useState('');
  const [error, setError] = useState(null);

  const queryPokemon = (regex) => {
    let resultList = getPokemon().filter((el) => {
      let ret = !el.name.includes('-') && el.name.match(regex);
      return ret;
    });
    setResultList(resultList);
  };

  const hintSearch = (hint) => {
    setError(null);
    queryPokemon(buildRegexFromHint(hint));
  };

  const renderContent = () => {
    return (
      <div>
        {resultList.length ? (
          resultList.map((item, i) => {
            let copyText = prefix ? prefix + ' ' + item.name : item.name;
            return (
              <div>
                <CopyToClipboard key={i} text={copyText}>
                  <Tooltip title="Copy">
                    <Button>{copyText} </Button>
                  </Tooltip>
                </CopyToClipboard>
              </div>
            );
          })
        ) : (
          <Empty />
        )}
      </div>
    );
  };

  return (
    <div className="flex justify-center align-items m-4">
      <div className="flex justify-center items-center flex-col">
        <div className="flex font-bold">PokeTwo Decypher</div>
        <div className="flex flex-row m-1">
          <Input
            placeholder="Prefix"
            onChange={(e) => {
              setPrefix(e.target.value);
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
  );
};

export default App;
