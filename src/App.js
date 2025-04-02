import React, { useState, useEffect } from "react";
import "./App.css"; // Подключаем стили

const symbols = ["♥", "♦", "♣", "♠", "★", "☆", "■", "□"];

const generateDeck = () => {
  let deck = [...symbols, ...symbols];
  return deck.sort(() => Math.random() - 0.5);
};

const MemoryGame = () => {
  const [deck, setDeck] = useState(() =>
    generateDeck().map((symbol, index) => ({
      id: index,
      symbol,
      flipped: false,
      matched: false,
    }))
  );
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [canClick, setCanClick] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const matchedSymbols = deck
      .filter((card) => card.matched)
      .map((card) => card.symbol);
    const counts = matchedSymbols.reduce((acc, sym) => {
      acc[sym] = (acc[sym] || 0) + 1;
      return acc;
    }, {});

    if (Object.values(counts).some((count) => count >= 4)) {
      setGameOver(true);
    }
  }, [deck]);

  const handleClick = (index) => {
    if (!canClick || deck[index].flipped || deck[index].matched) return;

    const newDeck = [...deck];
    newDeck[index].flipped = true;
    setDeck(newDeck);
    setSelected([...selected, newDeck[index]]);
    setMoves(moves + 1);
    setCanClick(false);

    setTimeout(() => setCanClick(true), 1000);
  };

  useEffect(() => {
    if (selected.length === 2) {
      const [first, second] = selected;
      if (first.symbol === second.symbol) {
        setDeck((prevDeck) =>
          prevDeck.map((card) =>
            card.symbol === first.symbol ? { ...card, matched: true } : card
          )
        );
      } else {
        setTimeout(() => {
          setDeck((prevDeck) =>
            prevDeck.map((card) =>
              card.id === first.id || card.id === second.id
                ? { ...card, flipped: false }
                : card
            )
          );
        }, 1000);
      }
      setSelected([]);
    }
  }, [selected]);

  const resetGame = () => {
    setDeck(
      generateDeck().map((symbol, index) => ({
        id: index,
        symbol,
        flipped: false,
        matched: false,
      }))
    );
    setMoves(0);
    setSelected([]);
    setGameOver(false);
  };

  return (
    <div className="game-container">
      <h1 className="title">🎴 Карточки на память 🎴</h1>
      <p className="moves">Ходы: {moves}</p>
      {gameOver && <h2 className="win-message">🎉 Вы выиграли! 🎉</h2>}
      <div className="grid">
        {deck.map((card) => (
          <div
            key={card.id}
            className={`card ${card.flipped || card.matched ? "flipped" : ""}`}
            onClick={() => handleClick(card.id)}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className="card-back">{card.symbol}</div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <button className="reset-button" onClick={resetGame}>
           Начать заново
        </button>
      </div>
    </div>
  );
};

export default MemoryGame;