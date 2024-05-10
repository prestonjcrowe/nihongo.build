import React, { useState, useEffect } from 'react';
import { toRomaji } from 'wanakana';
import './App.css';

const KanaMenuOverlay = ({ isOpen, onClose, selected, toggleSelected }) => {
  const [alphabet, setAlphabet] = useState("hiragana");
  const HIRAGANA_CHARACTERS = [
    "あ", "い", "う", "え", "お",
    "か", "き", "く", "け", "こ",
    "さ", "し", "す", "せ", "そ",
    "た", "ち", "つ", "て", "と",
    "な", "に", "ぬ", "ね", "の",
    "は", "ひ", "ふ", "へ", "ほ",
    "ま", "み", "む", "め", "も",
    "や", " ", "ゆ", " ", "よ",
    "ら", "り", "る", "れ", "ろ",
    "わ", " ", " ", " ", "を",
    " ", " ", "ん", " ", " ",
    "が", "ぎ", "ぐ", "げ", "ご",
    "ざ", "じ", "ず", "ぜ", "ぞ",
    "だ", "ぢ", "づ", "で", "ど",
    "ば", "び", "ぶ", "べ", "ぼ",
    "ぱ", "ぴ", "ぷ", "ぺ", "ぽ",
  ]

  const KATAKANA_CHARACTERS = [
    "ア", "イ", "ウ", "エ", "オ",
    "カ", "キ", "ク", "ケ", "コ",
    "サ", "シ", "ス", "セ", "ソ",
    "タ", "チ", "ツ", "テ", "ト",
    "ナ", "ニ", "ヌ", "ネ", "ノ",
    "ハ", "ヒ", "フ", "ヘ", "ホ",
    "マ", "ミ", "ム", "メ", "モ",
    "ヤ", " ", "ユ", " ", "ヨ",
    "ラ", "リ", "ル", "レ", "ロ",
    "ワ", " ", " ", " ", "ヲ",
    " ", " ", "ン", " ", " ",
    "ガ", "ギ", "グ", "ゲ", "ゴ",
    "ザ", "ジ", "ズ", "ゼ", "ゾ",
    "ダ", "ヂ", "ヅ", "デ", "ド",
    "バ", "ビ", "ブ", "ベ", "ボ",
    "パ", "ピ", "プ", "ペ", "ポ",
  ]

// ⠀⠀⠀⢸⣦⡀⠀⠀⠀⠀⢀⡄
// ⠀⠀⠀⢸⣏⠻⣶⣤⡶⢾⡿⠁
// ⠀⠀⣀⣼⠷⠀⠀⠁⢀⣿⠃⠀
// ⠴⣾⣯⣅⣀⠀⠀⠀⠈⢻⣦⡀
// ⠀⠀⠀⠉⢻⡇⣤⣾⣿⣷⣿⣿
// ⠀⠀⠀⠀⠸⣿⡿⠏⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠟⠁⠀⠀⠀⠀⠀
//             ⣤⡶⢶⣦⡀
// ⠀⠀⠀⣴⡿⠟⠷⠆⣠⠋⠀⠀⠀⢸⣿
// ⠀⠀⠀⣿⡄⠀⠀⠀⠈⠀⠀⠀⠀⣾⡿
// ⠀⠀⠀⠹⣿⣦⡀⠀⠀⠀⠀⢀⣾⣿
// ⠀⠀⠀⠀⠈⠻⣿⣷⣦⣀⣠⣾⡿
// ⠀⠀⠀⠀⠀⠀⠀⠉⠻⢿⡿⠟
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⡟⠀⠀⠀⢠⠏⡆⠀⠀⠀⠀⠀⢀⣀⣤⣤⣤⣀⡀
// ⠀⠀⠀⠀⠀⡟⢦⡀⠇⠀⠀⣀⠞⠀⠀⠘⡀⢀⡠⠚⣉⠤⠂⠀⠀⠀⠈⠙⢦⡀
// ⠀⠀⠀⠀⠀⡇⠀⠉⠒⠊⠁⠀⠀⠀⠀⠀⠘⢧⠔⣉⠤⠒⠒⠉⠉⠀⠀⠀⠀⠹⣆
// ⠀⠀⠀⠀⠀⢰⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⠀⠀⣤⠶⠶⢶⡄⠀⠀⠀⠀⢹⡆
// ⠀⣀⠤⠒⠒⢺⠒⠀⠀⠀⠀⠀⠀⠀⠀⠤⠊⠀⢸⠀⡿⠀⡀⠀⣀⡟⠀⠀⠀⠀⢸⡇
// ⠈⠀⠀⣠⠴⠚⢯⡀⠐⠒⠚⠉⠀⢶⠂⠀⣀⠜⠀⢿⡀⠉⠚⠉⠀⠀⠀⠀⣠⠟
// ⠀⠠⠊⠀⠀⠀⠀⠙⠂⣴⠒⠒⣲⢔⠉⠉⣹⣞⣉⣈⠿⢦⣀⣀⣀⣠⡴⠟


  const ALPHABETS = {
    "hiragana": HIRAGANA_CHARACTERS,
    "katakana": KATAKANA_CHARACTERS
  }

  const toggleAlphabet = () => {
    setAlphabet((prev) => {
      if (prev === "hiragana") {
        return "katakana"
      }

      return "hiragana";
    })
  }

  const KanaCharacter = ({ char }) => {
    if (char === " ") {
      return (<div></div>)
    }


    const className = selected.has(char) ?
      "kana-menu-character selected-kana" :
      "kana-menu-character";
    return (
      <div className={className} onClick={() => toggleSelected(char)}>{char}</div>
    )
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="kana-menu-container">
      <div className="kana-menu-controls-container">
        <div className="kana-menu-exit-button" onClick={onClose}>←</div>
        <div className="kana-menu-alphabet-button" onClick={toggleAlphabet}>{alphabet}</div>
      </div>
      <div className="kana-character-menu-container">
        {ALPHABETS[alphabet].map((c, i) => <KanaCharacter char={c} key={i} />)}
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

    let newWordList = []
    for (const word of dictionary["words"]) {
      let text = word["kana"][0]['text']
      if (shouldIncludeWord(text)) {
        let definition = word["sense"][0]["gloss"][0]["text"]
        let partOfSpeech = word["sense"][0]["partOfSpeech"][0]
        newWordList.push({ "text": text, "definition": definition, "partOfSpeech": partOfSpeech })
      }
    }

    console.log(`Word List Size: ${newWordList.length} total words`)
    console.log(`Shuffling word list...`)
    const shuffledWordList = newWordList
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)

    setWordList(new Set(shuffledWordList))
    setActiveWordIndex(0)
  }

  useEffect(() => {
    console.log("Dictionary loaded or selected kana changed, updating wordList...")
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
      if (e.keyCode !== 32 || wordList.size === 0) {
        return;
      }

      if (showDetails === true) {
        if (activeWordIndex === wordList.size - 1) {
          return;
        }
        setActiveWordIndex(prev => prev + 1)
      }

      setShowDetails(prev => !prev)
    }

    window.document.addEventListener('keyup', handleKeyUp);

    return () => {
      window.document.removeEventListener('keyup', handleKeyUp);
    }
  }, [activeWordIndex, showDetails, wordList]);

  const getRomajiString = (kana) => {
    return `(${[...kana].map((c) => toRomaji(c)).join('·')})`
  }

  let activeWord = wordList.size > 0 ? [...wordList][activeWordIndex]["text"] : "..."
  let activeRomaji = wordList.size > 0 ? getRomajiString(activeWord) : "..."
  let activeDefinition = wordList.size > 0 ? [...wordList][activeWordIndex]["definition"] : "..."
  let activePartOfSpeech = wordList.size > 0 ? entityCodes[[...wordList][activeWordIndex]["partOfSpeech"]] : "..."

  // setting for words in random order?
  // display word count (X out of Y remaining)?
  // can probs get rid of my stats?
  // would be cool if we could source common groups of words, i.e foods etc
  // i like the idea of discovering words by accident though...
  // maybe display multiple definitions ?
  // should any chars be selected by default?


  const toggleSelected = (char) => {
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
        {/* <div className="banner-title">romaji world</div>
        <div className="banner-subtitle">( • ̀ω•́ ) ✧ (●´ω｀●)</div> */}
        {/* <div className="banner-title">nihongo.build</div>
        <div className="banner-subtitle">( • ̀ω•́ )✧</div> */}
        <div className="banner-title">日本語.build</div>
        <div className="banner-subtitle">kana word building tool</div>
      </div>
      <div className="active-word-container">
        {
          wordList.size > 0 ?
            <div id="active-word">{activeWord}</div> :
            <div id="starting-text">edit kana to begin</div>
        }
        <div id="active-word-romaji">{showDetails ? activeRomaji : ""}</div>
        <div id="active-word-definition">{showDetails ? activeDefinition : ""}</div>

        {/* <div id="active-word-pos">{showDetails ? activePartOfSpeech : ""}</div> */}

      </div>
      <div className="menu-container">
      <div className="menu-item" onClick={() => setKanaMenuOpen(true)}>edit kana</div>
        <div className="menu-item">about</div>
        {/* <div className="menu-item">my stats</div> */}
      </div>
      <KanaMenuOverlay selected={selectedKana} isOpen={kanaMenuOpen} onClose={() => setKanaMenuOpen(false)} toggleSelected={toggleSelected} />
    </div>
  );
}

export default App;
