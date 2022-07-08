import './App.css';
import React from 'react';
import Die from './components/Die';
import Confetti from 'react-confetti'

export default function App () {
  function allNewDice () {
    let newArray = [];

    for (let count = 0; ; count++) {
      newArray.push(
        {
          value: Math.ceil(Math.random() * 6),
          isHeld: false,
          id: count
        }
      );
      if (newArray.length >= 10) break;
    }

    return newArray;
  }

  const [diceNumbers, setDiceNumbers] = React.useState(() => allNewDice());
  const [tenzies, setTenzies] = React.useState(() => false);

  React.useEffect(() => {
    let state = {
      value: diceNumbers[0].value,
    }

    let count = 0;

    diceNumbers.map(die => {
      if (state.value === die.value && die.isHeld === true) count++;
      return die;
    })

    if (count === diceNumbers.length) {
      setTenzies(true);
      console.log('You won!');
    } else {
      setTenzies(false);
    }
  }, [diceNumbers]);

  function rollDice (event) {
    console.log(event.target);
    if (event.target.value === 'New Game') {
      setTenzies(false);
      setDiceNumbers(allNewDice());
      return;
    }
    setDiceNumbers(prevState => prevState.map(die => {
      return die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) }
    }));
  }

  function handleClick (dieId) {
    setDiceNumbers(prevState => prevState.map(die => {
      return die.id === dieId ? { ...die, isHeld: !die.isHeld } : die
    }))
  }

  const dice = diceNumbers.map(die => 
    (<Die key={die.id} id={die.id} value={die.value} isHeld={die.isHeld} holdDie={() => handleClick(die.id)} />));

  return (
    <div className="App">
      <main className='main'>
        {tenzies && <Confetti />}
        <div className='main--title-container'>
          <div className='main--title'>
            Tenzies
          </div>
          <p className='main--description'>Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.
          </p>
        </div>
        <div className='main--die-container'>
          {dice}
        </div>
        <button onClick={rollDice} className='main--die-roller-button'>{tenzies ? 'New Game' : 'Roll'}</button>
      </main>
    </div>
  );
}
