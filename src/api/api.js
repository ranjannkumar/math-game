// src/api/api.js
// This file is a placeholder for future API calls.
// In the current implementation, the fetch call is handled directly in App.jsx.
// For more complex applications, it is a good practice to centralize API logic here.

export const sendPreTestResults = async (results) => {
  const requestData = {
    childName: results.childName,
    section: results.section,
    score: results.score,
    totalQuestions: results.totalQuestions,
    timeTaken: results.timeTaken,
    accuracy: results.accuracy,
    date: new Date().toLocaleString()
  };

  const urls = [
    '/api/send-results',  // Proxy URL (if proxy is working)
    'http://localhost:3001/api/send-results'  // Direct URL
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Results sent successfully:', responseData);
        return responseData;
      }
    } catch (error) {
      console.error(`Error sending results to ${url}:`, error);
    }
  }

  throw new Error('Failed to send results to all configured endpoints.');
};