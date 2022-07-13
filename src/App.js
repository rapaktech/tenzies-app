import './App.css';
import React from 'react';
import Die from './components/Die';
import Confetti from 'react-confetti';

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
  const [numberOfRolls, setNumberOfRolls] = React.useState(() => 0);
  const [isActive, setIsActive] = React.useState(() => false);
  const [isPaused, setIsPaused] = React.useState(() => false);
  const [time, setTime] = React.useState(() => 0);
  const [bestTime, setBestTime] = React.useState(() => 0);
  
  React.useEffect(() => {
    setBestTime(Number(localStorage.getItem('tenzies-best-time')));
    setIsActive(true);
    let interval = null;
  
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused]);

  const [tenzies, setTenzies] = React.useState(() => false);

  React.useEffect(() => {
    if (tenzies) {
      setIsPaused(true);
      if (bestTime > time) {
        localStorage.setItem('tenzies-best-time', String(time));
        setBestTime(Number(localStorage.getItem('tenzies-best-time')));
      }
    }
  }, [tenzies, bestTime, time]);

  React.useEffect(() => {
    const value = diceNumbers[0].value;
    let count = 0;

    diceNumbers.map(die => {
      if (value === die.value && die.isHeld === true) count++;
      return die;
    })

    if (count === diceNumbers.length) {
      setTenzies(true);
    } else {
      setTenzies(false);
    }
  }, [diceNumbers]);

  function rollDice (event) {
    if (event.target.value === 'New Game') {
      setTenzies(false);
      setIsPaused(false);
      setNumberOfRolls(0);
      setTime(0);
      setDiceNumbers(allNewDice());
      return;
    }

    setNumberOfRolls(prevState => prevState + 1);
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
        <p className='main--counter'>Number of rolls: {numberOfRolls}</p>
        <p className='main--counter'>Time taken: {time}, Best time: {bestTime}</p>
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
        <button onClick={rollDice} className='main--die-roller-button' value={tenzies ? 'New Game' : 'Roll'}>{tenzies ? 'New Game' : 'Roll'}</button>
      </main>
    </div>
  );
}
