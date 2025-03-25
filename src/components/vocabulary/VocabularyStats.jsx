// src/components/vocabulary/VocabularyStats.jsx
import React, { useMemo } from 'react';

const VocabularyStats = ({ vocabulary }) => {
  const stats = useMemo(() => {
    // Toplam kelime sayısı
    const totalWords = vocabulary.length;

    // Seviye başına kelime sayıları
    const byLevel = vocabulary.reduce((acc, item) => {
      acc[item.level] = (acc[item.level] || 0) + 1;
      return acc;
    }, {});

    // Öğrenilen kelime sayısı
    const mastered = vocabulary.filter(item => item.isMastered).length;

    // Öğrenilme yüzdesi
    const masteredPercentage = totalWords > 0 ? (mastered / totalWords * 100).toFixed(1) : 0;
    return (
      <div className="vocabulary-stats">
        <p>Toplam kelime sayısı: {totalWords}</p>
        <p>Seviye başına kelime sayıları: {JSON.stringify(byLevel)}</p>
        <p>Öğrenilen kelime sayısı: {mastered}</p>
        <p>Öğrenilme yüzdesi: {masteredPercentage}%</p>
      </div>
    );

  }, [vocabulary]);

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  return (
    <div className="vocabulary-stats">
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Toplam Kelime</h3>
          <div className="stat-value">{stats.totalWords}</div>
        </div>

        <div className="stat-card">
          <h3>Öğrenilen</h3>
          <div className="stat-value">{stats.mastered}</div>
          <div className="stat-percentage">{stats.masteredPercentage}%</div>
        </div>
      </div>

      <div className="level-distribution">
        <h3>Seviye Dağılımı</h3>
        <div className="level-bars">
          {levels.map(level => (
            <div key={level} className="level-bar-container">
              <div className="level-label">{level}</div>
              <div className="level-bar-wrapper">
                <div
                  className={`level-bar ${level.toLowerCase()}`}
                  style={{
                    width: `${stats.totalWords > 0 ? (stats.byLevel[level] || 0) / stats.totalWords * 100 : 0}%`
                  }}
                ></div>
              </div>
              <div className="level-count">{stats.byLevel[level] || 0}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VocabularyStats;