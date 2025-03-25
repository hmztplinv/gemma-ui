// src/components/vocabulary/VocabularyFlashcards.jsx
import React, { useState, useEffect } from 'react';

const VocabularyFlashcards = ({ vocabulary }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffledVocabulary, setShuffledVocabulary] = useState([]);
  
  useEffect(() => {
    // Kelimeleri karıştır
    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5);
    setShuffledVocabulary(shuffled);
    setCurrentIndex(0);
    setFlipped(false);
  }, [vocabulary]);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleNext = () => {
    if (currentIndex < shuffledVocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
    }
  };

  if (shuffledVocabulary.length === 0) {
    return <div className="no-cards">Görüntülenecek kelime kartı yok.</div>;
  }

  const currentCard = shuffledVocabulary[currentIndex];

  return (
    <div className="flashcards-container">
      <div className="progress-indicator">
        {currentIndex + 1} / {shuffledVocabulary.length}
      </div>
      
      <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <div className="card-level">{currentCard.level}</div>
            <div className="card-word">{currentCard.word}</div>
            <p className="flip-hint">Çeviriyi görmek için tıklayın</p>
          </div>
          <div className="flashcard-back">
            <div className="card-translation">{currentCard.translation || "Çeviri yok"}</div>
            <div className="card-stats">
              <div>Karşılaşma: {currentCard.timesEncountered}</div>
              <div>Doğru Kullanım: {currentCard.timesCorrectlyUsed}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flashcard-controls">
        <button 
          className="control-btn" 
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          Önceki
        </button>
        <button 
          className="control-btn" 
          onClick={handleNext}
          disabled={currentIndex === shuffledVocabulary.length - 1}
        >
          Sonraki
        </button>
      </div>
    </div>
  );
};

export default VocabularyFlashcards;