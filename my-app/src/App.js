import React, { useState, useEffect } from 'react';

function App() {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        // Fetch data from the external API
        const response = await fetch('/api/v1/transactions'); // Use relative URL to leverage the proxy
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        setApiData(jsonData);
        console.log('Fetched data:', jsonData);
        
        // Send data to the backend
        await sendDataToBackend(jsonData);
      } catch (err) {
        console.error('Error fetching data from API:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApiData();
  }, []); // Empty dependency array means this effect runs once on mount

  const sendDataToBackend = async (data) => {
    try {
      const response = await fetch('http://localhost:5001/api/apidata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log('Response from backend:', result);
    } catch (error) {
      console.error('Error sending data to backend:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Fetched Data</h1>
      <pre>{JSON.stringify(apiData, null, 2)}</pre>
    </div>
  );
}

export default App;