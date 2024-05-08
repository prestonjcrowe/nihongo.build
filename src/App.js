import React, { useState, useEffect } from 'react';
import { toRomaji } from 'wanakana';
import './App.css';

// function KanaOverlay() {
//   return (

//   )
// }

function KanaMenuOverlay({ isOpen, onClose, selected, toggleSelected }) {
  const HIRAGANA_CHARACTERS = [
    "あ", "い", "う", "え", "お",
    "か","き", "く", "け", "こ",
    "さ","し", "す", "せ", "そ",
    "た","ち", "つ", "て", "と",
    "な","に", "ぬ", "ね", "の",
    "は","ひ", "ふ", "へ", "ほ",
    "ま","み", "む", "め", "も",
    "や", " ", "ゆ", " ", "よ",
    "ら","り", "る", "れ", "ろ",
    "わ"," ", " ", " ", "を",
    " ", " ", "ん", " ", " ",
    "が", "ぎ", "ぐ", "げ", "ご",
    "ざ", "じ", "ず", "ぜ", "ぞ",
    "だ", "ぢ", "づ", "で", "ど",
    "ば", "び", "ぶ", "べ", "ぼ",
    "ぱ", "ぴ", "ぷ", "ぺ", "ぽ",

  ]

  const KanaCharacter = ({ char }) => {
    if (char === " ") {
      return (<div></div>)
    }


    let className = selected.has(char) ? "kana-menu-character selected-kana" : "kana-menu-character";
    console.log(className)
    return (
      <div className={className} onClick={() => toggleSelected(char)}>{char}</div>
    )
  }

  if (!isOpen) {
    return null;
  }
  
  return (
    <div className="kana-menu-container">
      <div className="kana-menu-exit-button" onClick={onClose}>←</div>
      <div className="kana-character-menu-container">
        {HIRAGANA_CHARACTERS.map((c, i) => <KanaCharacter char={c} key={i}/>)}
      </div>
    </div>
  )
}


function App() {

  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [selectedKana, setSelectedKana] = useState(new Set([]))
  const [wordList, setWordList] = useState(new Set([]))
  const [showDetails, setShowDetails] = useState(false)
  const [dictionary, setDictionary] = useState([])
  const [entityCodes, setEntityCodes] = useState({})
  const [kanaMenuOpen, setKanaMenuOpen] = useState(false)

  const shouldIncludeWord = (word) => {
    for (let i = 0; i < word.length; i++) {
      if (!selectedKana.has(word.charAt(i))) {
          return false
      }
    }
  
    return true
  }

  const updateWordList = () => {
    if (!dictionary || !("words" in dictionary)) {
      return;
    }

    let newWordList = new Set([])
    for (const word of dictionary["words"]) {
        let text = word["kana"][0]['text']
        if (shouldIncludeWord(text)) {
            let definition = word["sense"][0]["gloss"][0]["text"]
            let partOfSpeech = word["sense"][0]["partOfSpeech"][0]
            newWordList.add({"text": text, "definition": definition, "partOfSpeech": partOfSpeech})
        }
    }

    // console.log(`Selected Characters: ${selectedKana}`)
    // console.log(`Word List Size: ${newWordList.size} total words`)
    setWordList(newWordList)
    setActiveWordIndex(0)
  }
  
  useEffect(() => {
    console.log("Dictionary or selected kana changed, updating wordList...")
    updateWordList(selectedKana)
  }, [dictionary, selectedKana])


  useEffect(() => {
    console.log("Fetching dictionary JSON...")
    fetch('entity_codes.json')
      .then((r) => r.json())
      .then((data) => setEntityCodes(data))
      .then(() => fetch('jmdict-eng-common.json'))
      .then((r) => r.json())
      .then((data) => setDictionary(data))
  }, [])

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.keyCode !== 32) {
        return;
      }

      console.log(activeWordIndex, showDetails)
      if (showDetails === true) {
        console.log('hello')
        setActiveWordIndex(prev => prev + 1)
      }

      setShowDetails(prev => !prev)
    }
  
    window.document.addEventListener('keyup', handleKeyUp);
  
    return () => {
      window.document.removeEventListener('keyup', handleKeyUp);
    }
  }, [activeWordIndex, showDetails]);

  let activeWord = wordList.size > 0 ? [...wordList][activeWordIndex]["text"] : "..."
  let activeRomaji = wordList.size > 0 ? toRomaji(activeWord) : "..."
  let activeDefinition = wordList.size > 0 ? [...wordList][activeWordIndex]["definition"] : "..."
  let activePartOfSpeech = wordList.size > 0 ? entityCodes[[...wordList][activeWordIndex]["partOfSpeech"]] : "..."

  let toggleSelected = (char) => {
    console.log(`Toggling ${char}`)
    let newSelectedKana = new Set([...selectedKana])

    if (selectedKana.has(char)) {
      newSelectedKana.delete(char);
    } else {
      newSelectedKana.add(char);
    }

    console.log(newSelectedKana)
    setSelectedKana(newSelectedKana);
  }


  return (
    <div className="app-container">
      <div className="banner-container">
        <div className="banner-title">日本語.build</div>
        <div className="banner-subtitle">kana word building tool</div>

      </div>
      <div className="active-word-container">
          <div id="active-word">{activeWord}</div>
          <div id="active-word-romaji">{showDetails ? activeRomaji : ""}</div>
          <div id="active-word-definition">{showDetails ? activeDefinition : ""}</div>
          {/* <div id="active-word-pos">{showDetails ? activePartOfSpeech : ""}</div> */}

      </div>
      <div className="menu-container">
        <div className="menu-item">about</div>
        <div className="menu-item" onClick={() => setKanaMenuOpen(true)}>edit kana</div>
        <div className="menu-item">my stats</div>
      </div>
      <KanaMenuOverlay selected={selectedKana} isOpen={kanaMenuOpen} onClose={() => setKanaMenuOpen(false)} toggleSelected={toggleSelected}/>
    </div>
  );
}

export default App;
