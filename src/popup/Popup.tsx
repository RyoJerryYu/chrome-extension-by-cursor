import React, { useState } from 'react';

const Popup: React.FC = () => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://example.com/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: inputText,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ padding: '16px', width: '300px' }}>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        style={{ width: '100%', height: '150px', marginBottom: '10px' }}
        placeholder="Enter your text here..."
      />
      <button 
        onClick={handleSubmit}
        style={{ width: '100%', padding: '8px' }}
      >
        Submit
      </button>
    </div>
  );
};

export default Popup; 