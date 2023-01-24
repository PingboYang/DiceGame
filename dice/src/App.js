import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import images from "./images"



export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [count,setCount] = React.useState(0)

    const [stopwatch, setStopwatch] = React.useState(0)
    const [timer, setTimer] = React.useState(false)

    const [time, setTime] = React.useState({
        startTime: 0,
        duration: 0,
        durations: []
    })
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice]) 

    React.useEffect(() => {
        if (tenzies) {
            const endTime = Math.floor(Date.now() / 1000)
            const dur = endTime - time.startTime
            time.durations.push(dur)
            setTime(({ ...time, duration: dur }))
            const bestTime = Math.min(...time.durations)
            localStorage.setItem("BestTime" + endTime.toString(), bestTime)
        }
    }, [tenzies])

    React.useEffect(() => {
        if (timer) {
            const timerId = setInterval(() => {
                setStopwatch(pre => pre + 1)
            }, 1000)
            return () => {
                setTimer(false)
                clearInterval(timerId)
            }
        }

    }, [timer, tenzies])

    function generateNewDie() {
        const diceImageArray=images.data.diceImage
        const randomNumber= Math.floor(Math.random() * 6)
        const url=diceImageArray[randomNumber].url
        return {
            value: url,
            isHeld: false,
            id: nanoid()
        }
    }
    
   
    
    function allNewDice() {
        const newDice = []
        
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
            
        }
        return newDice
    }
    
    function rollDice() {
        setCount(count+1)
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setCount(0)
            setTime(({ ...time, startTime: 0, duration: 0 }))
            setTimer(false)
            setStopwatch(0)
        }
    }
    
    function holdDice(id) {
        const allNotHeld = dice.every(die => !die.isHeld)
        if (allNotHeld) {
            time.startTime = Math.floor(Date.now() / 1000)
            setTime(time)
            setTimer(true)
        }

        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
                
                
            </button>
            <div>
                <p>Count：{count}</p>
                <p>duration: {time.duration}</p>
                <p>stopwatch: {stopwatch}</p>
               
            </div>
        </main>
    )
}