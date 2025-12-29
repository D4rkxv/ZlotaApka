/**
 Zadanie: Prosty Timer z przyciskiem Start/Stop
Stwórz komponent Timer, który odlicza sekundy od momentu wciśnięcia przycisku "Start". Timer powinien się zatrzymać po wciśnięciu przycisku "Stop". Komponent ma korzystać z hooka useEffect do uruchamiania i zatrzymywania odliczania.

Instrukcje:
Stwórz komponent Timer z następującymi funkcjami:

Stan seconds, który przechowuje liczbę sekund (zaczyna od 0).
Stan isActive, który kontroluje, czy timer jest aktywny (zaczyna od false).
Użyj hooka useEffect do:

Uruchomienia timera (ustawienia interwału co 1 sekundę) wtedy, gdy isActive jest ustawiony na true.
Zatrzymania timera i wyczyszczenia interwału, gdy isActive jest ustawiony na false.
Dodaj dwa przyciski:

"Start", który ustawia isActive na true.
"Stop", który ustawia isActive na false i zatrzymuje timer.
Po naciśnięciu "Stop", licznik czasu powinien się zatrzymać, ale zachować dotychczasowy wynik.
 */

import React, { useState, useEffect } from 'react'
const Timer = () => {
	const [seconds, setSeconds] = useState(0) // liczba sekund
	const [isActive, setIsActive] = useState(false) //status timera
	// funkcja strzałkowa wykona się z każdą zmianą flagi w isActive
	useEffect(() => {
		let interval = null
		// funkcja setInterval wykonuje kod zawarty wewnątrz co jedną sekundę
		if (isActive) {
			interval = setInterval(() => {
				setSeconds(prevSeconds => prevSeconds + 1)
			}, 1000)
		
		 // Czyszczenie interwału przy odmontowaniu lub zmianie isActive (funkcja czyszcząca)
		return () => clearInterval(interval)
	}, [isActive])
	// funkcję zmieniające stan obiektu
	const handleStart = () => setIsActive(true)
	const handleStop = () => setIsActive(false)
	return (
		<>
			<h2>Timer: {seconds}</h2>
			<button onClick={handleStart}>Start</button>
			<button onClick={handleStop}>Stop</button>
		</>
	)
}
export default Timer
