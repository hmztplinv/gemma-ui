// src/components/vocabulary/VocabularyItem.jsx
import React, { useState } from 'react';

const VocabularyItem = ({ word, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [translation, setTranslation] = useState(word.translation || '');
  
  const handleSave = () => {
    onUpdate(word.id, { translation });
    setIsEditing(false);
  };
  
  return (
    <tr>
      <td>{word.word}</td>
      <td>
        {isEditing ? (
          <input 
            type="text" 
            value={translation} 
            onChange={(e) => setTranslation(e.target.value)}
            className="translation-input"
          />
        ) : (
          translation || '-'
        )}
      </td>
      <td><span className={`level-badge ${word.level.toLowerCase()}`}>{word.level}</span></td>
      <td>{word.timesEncountered}</td>
      <td>{word.timesCorrectlyUsed}</td>
      <td>{new Date(word.lastEncounteredAt).toLocaleDateString()}</td>
      <td>
        <span className={`status ${word.isMastered ? 'mastered' : 'learning'}`}>
          {word.isMastered ? 'Learned' : 'Learning'}
        </span>
      </td>
      <td>
        {isEditing ? (
          <>
            <button onClick={handleSave} className="save-btn">Save</button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
        )}
      </td>
    </tr>
  );
};

export default VocabularyItem;