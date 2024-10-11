import React, { useState, useEffect } from 'react';

function App() {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartPath, setChartPath] = useState(null);

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        // Fetch data from the external API
        const response = await fetch('/api/v1/transactions'); // Use relative URL to leverage the proxy
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        setApiData(jsonData); // Save the fetched data
        console.log('Fetched data:', jsonData);
        
        // Send data to the backend
        const chartResponse = await sendDataToBackend(jsonData);
        if (chartResponse.bar_chart_path) { // Check if the response contains the path to the bar chart
          // Ensure to include the port number for the Flask server
          setChartPath(`http://localhost:5001/${chartResponse.bar_chart_path}`);
        }
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
      return result; // Return the result to access bar_chart_path
    } catch (error) {
      console.error('Error sending data to backend:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Fetched Data</h1>
      {/* <pre>{JSON.stringify(apiData, null, 2)}</pre> */}
      {chartPath && (
        <div>
          <h2>Bar Chart</h2>
          <img 
            src={chartPath} 
            alt="Bar Chart" 
            style={{ width: '600px', height: 'auto' }} // Adjust size as needed
            onError={(e) => { e.target.src = 'fallback-image-url'; }} // Add a fallback image if needed
          />
        </div>
      )}
    </div>
  );
}

export default App;