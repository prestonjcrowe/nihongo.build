import React, { useState, useEffect } from 'react';
import { isHiragana, isKana, isRomaji, toRomaji } from 'wanakana';
import './App.css';

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

const KanaMenuOverlay = ({ isOpen, onClose, selected, setSelectedKana }) => {
  const [alphabet, setAlphabet] = useState("hiragana");
  const [activeRomajiLabels, setActiveRomajiLabels] = useState({
    "hiragana": [],
    "katakana": []
  });
  const HIRAGANA_CHARACTERS = [
    " ", "a", "i", "u", "e", "o",
    " ", "あ", "い", "う", "え", "お",
    "k", "か", "き", "く", "け", "こ",
    "s", "さ", "し", "す", "せ", "そ",
    "t", "た", "ち", "つ", "て", "と",
    "n", "な", "に", "ぬ", "ね", "の",
    "h", "は", "ひ", "ふ", "へ", "ほ",
    "m", "ま", "み", "む", "め", "も",
    "y", "や", " ", "ゆ", " ", "よ",
    "r", "ら", "り", "る", "れ", "ろ",
    "w", "わ", " ", " ", " ", "を",
    "n/m", " ", " ", "ん", " ", " ",
    "g", "が", "ぎ", "ぐ", "げ", "ご",
    "z", "ざ", "じ", "ず", "ぜ", "ぞ",
    "d", "だ", "ぢ", "づ", "で", "ど",
    "b", "ば", "び", "ぶ", "べ", "ぼ",
    "p", "ぱ", "ぴ", "ぷ", "ぺ", "ぽ",
  ]

  const KATAKANA_CHARACTERS = [
    " ", "a", "i", "u", "e", "o",
    " ", "ア", "イ", "ウ", "エ", "オ",
    "k", "カ", "キ", "ク", "ケ", "コ",
    "s", "サ", "シ", "ス", "セ", "ソ",
    "t", "タ", "チ", "ツ", "テ", "ト",
    "n", "ナ", "ニ", "ヌ", "ネ", "ノ",
    "h", "ハ", "ヒ", "フ", "ヘ", "ホ",
    "m", "マ", "ミ", "ム", "メ", "モ",
    "y", "ヤ", " ", "ユ", " ", "ヨ",
    "r", "ラ", "リ", "ル", "レ", "ロ",
    "w", "ワ", " ", " ", " ", "ヲ",
    "n/m", " ", " ", "ン", " ", " ",
    "g", "ガ", "ギ", "グ", "ゲ", "ゴ",
    "z", "ザ", "ジ", "ズ", "ゼ", "ゾ",
    "d", "ダ", "ヂ", "ヅ", "デ", "ド",
    "b", "バ", "ビ", "ブ", "ベ", "ボ",
    "p", "パ", "ピ", "プ", "ペ", "ポ",
  ]

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

  const updateRomajiLabels = (newSelectedKana) => {
    var selectedRowLabels = [];
    var selectedColLabels = [];
    
    // Start by finding all the fully selected ROWS
    for (var i = 7; i < ALPHABETS[alphabet].length; i += 6) {
      for (var j = i; j < i + 5; j++) {
        if (ALPHABETS[alphabet][j] !== " " && !newSelectedKana.has(ALPHABETS[alphabet][j])) {
          break;
        } else if (j === i + 4) {
          // This ROW is fully selected
          let rowLabel = ALPHABETS[alphabet][Math.ceil(j / 6) * 6 - 6];
          if (rowLabel !== " ") {
            console.log(`Row ${rowLabel} is fully selected`)
            selectedRowLabels.push(rowLabel)  
          }
        }
      }
    }

      // Now find all the fully selected COLS
      for (var i = 7; i < 12; i++) {
        for (var j = i; j < ALPHABETS[alphabet].length; j += 6) {
          if (ALPHABETS[alphabet][j] !== " " && !newSelectedKana.has(ALPHABETS[alphabet][j])) {
            break;
          } else if (j + 6 >= ALPHABETS[alphabet].length) {
            // This COL is fully selected
            let colLabel = ALPHABETS[alphabet][j % 6];

            selectedColLabels.push(colLabel);

            console.log(`Column ${colLabel} is fully selected`)
          }
        }
      }

      let labels = selectedColLabels.concat(selectedRowLabels);
      let newActiveRomajiLabels = { ...activeRomajiLabels };
      newActiveRomajiLabels[alphabet] = labels;
      setActiveRomajiLabels(newActiveRomajiLabels)
    
    
    
      // console.log(`Updating labels after toggling ${char}`);

    // if (removed) {
    //   let index = ALPHABETS[alphabet].indexOf(char);
    //   let col_selector = ALPHABETS[alphabet][index % 6];
    //   let row_selector = ALPHABETS[alphabet][Math.ceil(index / 6) * 6 - 6];
    //   console.log(`row label: ${row_selector} col label: ${col_selector}`)

    //   let activeAlphabetLabels = activeRomajiLabels[alphabet];
    //   // If either row or column label is active, must disable both
    //   if (activeAlphabetLabels.includes(col_selector) || activeAlphabetLabels.includes(row_selector)) {
    //     let labels = activeAlphabetLabels.filter(l => l !== col_selector && l !== row_selector);
    //     let newActiveRomajiLabels = { ...activeRomajiLabels };
    //     newActiveRomajiLabels[alphabet] = labels;
    //     setActiveRomajiLabels(newActiveRomajiLabels)
    //   }
    // } else {
    //   let index = ALPHABETS[alphabet].indexOf(char);
    //   let col_selector_idx = index % 6;
    //   let row_selector_idx = Math.ceil(index / 6) * 6 - 6;
    //   let char_row = [];
    //   let char_col = [];

    //   for (var i = 7; i < ALPHABETS[alphabet].length; i++) {
    //     if (i % 6 === col_selector_idx && isKana(ALPHABETS[alphabet][i])) {
    //       // This character is in the same col
    //       char_col.push(ALPHABETS[alphabet][i]);
    //     }
    //     if (i > row_selector_idx && i < row_selector_idx + 6 && isKana(ALPHABETS[alphabet][i])) {
    //       char_row.push(ALPHABETS[alphabet][i])
    //     }
    //   }

    //   let colSelected = char_col.reduce((acc, cur) => acc && newSelectedKana.has(cur), true);
    //   let rowSelected = char_row.reduce((acc, cur) => acc && newSelectedKana.has(cur), true);

    //   if (colSelected) {
    //     let colLabel = ALPHABETS[alphabet][index % 6];
    //     let newLabels = [...new Set(activeRomajiLabels[alphabet]), colLabel];
    //     let newActiveRomajiLabels = {...activeRomajiLabels};
    //     newActiveRomajiLabels[alphabet] = newLabels;
    //     setActiveRomajiLabels(newActiveRomajiLabels);
    //   }

    //   if (rowSelected) {
    //     let rowLabel = ALPHABETS[alphabet][Math.ceil(index / 6) * 6 - 6];

    //     let newLabels = [...new Set(activeRomajiLabels[alphabet]), rowLabel];
    //     let newActiveRomajiLabels = {...activeRomajiLabels};
    //     newActiveRomajiLabels[alphabet] = newLabels;
    //     setActiveRomajiLabels(newActiveRomajiLabels);
    //   }

    //   console.log(newSelectedKana)
    //   console.log(char_row)
    //   console.log(char_col)
    //   console.log(rowSelected)
    //   console.log(colSelected)
    // }


    // console.log(newSelectedKana)
    // setSelectedKana(newSelectedKana);
  
  }

  const KanaCharacter = ({ char }) => {
    if (char === " ") {
      return (<div></div>)
    }

    const toggleSelected = (char) => {
      console.log(`Toggling ${char}`);
      let newSelectedKana = new Set([...selected]);
      let removed = selected.has(char);
      if (removed) {
        newSelectedKana.delete(char);
        // let index = ALPHABETS[alphabet].indexOf(char);
        // let col_selector = ALPHABETS[alphabet][index % 6];
        // let row_selector = ALPHABETS[alphabet][Math.ceil(index / 6) * 6 - 6];
        // console.log(`row label: ${row_selector} col label: ${col_selector}`)

        // let activeAlphabetLabels = activeRomajiLabels[alphabet];
        // // If either row or column label is active, must disable both
        // if (activeAlphabetLabels.includes(col_selector) || activeAlphabetLabels.includes(row_selector)) {
        //   let labels = activeAlphabetLabels.filter(l => l !== col_selector && l !== row_selector);
        //   let newActiveRomajiLabels = { ...activeRomajiLabels };
        //   newActiveRomajiLabels[alphabet] = labels;
        //   setActiveRomajiLabels(newActiveRomajiLabels)
        // }
      } else {
        newSelectedKana.add(char);
        // let index = ALPHABETS[alphabet].indexOf(char);
        // let col_selector_idx = index % 6;
        // let row_selector_idx = Math.ceil(index / 6) * 6 - 6;
        // let char_row = [];
        // let char_col = [];

        // for (var i = 7; i < ALPHABETS[alphabet].length; i++) {
        //   if (i % 6 === col_selector_idx && isKana(ALPHABETS[alphabet][i])) {
        //     // This character is in the same col
        //     char_col.push(ALPHABETS[alphabet][i]);
        //   }
        //   if (i > row_selector_idx && i < row_selector_idx + 6 && isKana(ALPHABETS[alphabet][i])) {
        //     char_row.push(ALPHABETS[alphabet][i])
        //   }
        // }

        // let colSelected = char_col.reduce((acc, cur) => acc && newSelectedKana.has(cur), true);
        // let rowSelected = char_row.reduce((acc, cur) => acc && newSelectedKana.has(cur), true);

        // if (colSelected) {
        //   let colLabel = ALPHABETS[alphabet][index % 6];
        //   let newLabels = [...new Set(activeRomajiLabels[alphabet]), colLabel];
        //   let newActiveRomajiLabels = {...activeRomajiLabels};
        //   newActiveRomajiLabels[alphabet] = newLabels;
        //   setActiveRomajiLabels(newActiveRomajiLabels);
        // }

        // if (rowSelected) {
        //   let rowLabel = ALPHABETS[alphabet][Math.ceil(index / 6) * 6 - 6];

        //   let newLabels = [...new Set(activeRomajiLabels[alphabet]), rowLabel];
        //   let newActiveRomajiLabels = {...activeRomajiLabels};
        //   newActiveRomajiLabels[alphabet] = newLabels;
        //   setActiveRomajiLabels(newActiveRomajiLabels);
        // }

        console.log(newSelectedKana)
        // console.log(char_row)
        // console.log(char_col)
        // console.log(rowSelected)
        // console.log(colSelected)
      }


      console.log(newSelectedKana)
      setSelectedKana(newSelectedKana);
      updateRomajiLabels(newSelectedKana, removed, char);
    }

    const toggleRomajiLabel = (romaijLabel) => {
      // This method only to be called to select all in a row / column OR
      // unselect all in a row / column only if they are all selected.
      // Another method will unset romaji label if an encompassed character
      // is deselected.
      console.log(activeRomajiLabels)
      const vowels = ["a", "i", "u", "e", "o"];
      const deselect = activeRomajiLabels[alphabet].includes(romaijLabel);
      const isVowel = vowels.includes(romaijLabel);

      let index = ALPHABETS[alphabet].indexOf(romaijLabel);
      let newSelectedKana = new Set([...selected]);

      for (let i = 0; i < ALPHABETS[alphabet].length; i++) {
        let c = ALPHABETS[alphabet][i];
        if (c === " ") {
          continue;
        }
        if (i > index && (isVowel && i % 6 === index) || (!isVowel && Math.ceil(i / 6) * 6 - 6 === index)) {
          if (deselect) {
            console.log(`removing ${c}`)
            newSelectedKana.delete(c);

          } else if (isKana(c)) {
            console.log(`adding ${c}`)
            newSelectedKana.add(c);
          }
        }
      }
      console.log(selected)
      console.log(newSelectedKana)
      console.log(`new kana: ${newSelectedKana.size}`)
      setSelectedKana(newSelectedKana);

      updateRomajiLabels(newSelectedKana, deselect, char)
      // if (activeRomajiLabels[alphabet].includes(romaijLabel)) {
      //   let labels = activeRomajiLabels[alphabet].filter(l => l !== romaijLabel);
      //   let newActiveRomajiLabels = { ...activeRomajiLabels };
      //   newActiveRomajiLabels[alphabet] = labels;
      //   setActiveRomajiLabels(newActiveRomajiLabels);
      // } else {
      //   let labels = [...activeRomajiLabels[alphabet], romaijLabel];
      //   let newActiveRomajiLabels = { ...activeRomajiLabels }
      //   newActiveRomajiLabels[alphabet] = labels;
      //   setActiveRomajiLabels(newActiveRomajiLabels);
      // }

    }

    // This is a romaji label
    if (!isKana(char)) {
      const className = activeRomajiLabels[alphabet].includes(char) ?
        "kana-menu-romaji-label selected-romaji-label" :
        "kana-menu-romaji-label";

      return <div className={className} onClick={() => toggleRomajiLabel(char)}>{char}</div>;
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
        {
          ALPHABETS[alphabet].map((c, i) => {
            // if (c !== " " && !(c in HIRAGANA_CHARACTERS) && !(c in KATAKANA_CHARACTERS)) {
            //   return <div className="kana-menu-romaji-label">{c}</div>;
            // }
            return <KanaCharacter char={c} key={i} />;
          })
        }
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

  // Load dictionary on component mount
  useEffect(() => {
    console.log("Fetching dictionary JSON...")
    fetch('entity_codes.json')
      .then((r) => r.json())
      .then((data) => setEntityCodes(data))
      .then(() => fetch('jmdict-eng-common.json'))
      .then((r) => r.json())
      .then((data) => setDictionary(data))
  }, [])

  // Update word list when dictionary or kana updates
  useEffect(() => {
    console.log("Dictionary loaded or selected kana changed, updating wordList...")
    updateWordList(selectedKana)
  }, [dictionary, selectedKana])


  const nextWord = () => {
    if (showDetails) {
      if (activeWordIndex === wordList.size - 1) {
        return;
      }
      setActiveWordIndex(prev => prev + 1)
    }

    setShowDetails(prev => !prev)
  }
  // Handle key press events
  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.keyCode !== 32 || wordList.size === 0) {
        return;
      }

      if (showDetails) {
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

  const activeWord = wordList.size > 0 ? [...wordList][activeWordIndex]["text"] : "..."
  const activeRomaji = wordList.size > 0 ? getRomajiString(activeWord) : "..."
  const activeDefinition = wordList.size > 0 ? [...wordList][activeWordIndex]["definition"] : "..."
  const activePartOfSpeech = wordList.size > 0 ? entityCodes[[...wordList][activeWordIndex]["partOfSpeech"]] : "..."

  return (
    <div className="app-container">
      <div className="banner-container">
        <div className="banner-title">romaji.build</div>
        <div className="banner-subtitle">( • ̀ω•́ ) ✧ (●´ω｀●)</div>
        {/* <div className="banner-title">nihongo.build</div>
        <div className="banner-subtitle">kana word building tool</div> */}
      </div>
      <div className="active-word-container" onTouchStart={nextWord}>
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
      <KanaMenuOverlay selected={selectedKana} isOpen={kanaMenuOpen} onClose={() => setKanaMenuOpen(false)} setSelectedKana={setSelectedKana} />
    </div>
  );
}

export default App;