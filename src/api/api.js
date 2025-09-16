// src/api/api.js
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

      if (!response.ok) {
        let errorMessage = `HTTP error! Status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log('Results sent successfully:', responseData);
      return responseData;

    } catch (error) {
      console.error(`Error with URL ${url}:`, error);
    }
  }

  throw new Error('Failed to send results to all configured endpoints.');
};