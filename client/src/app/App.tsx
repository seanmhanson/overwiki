import React, { useState, useEffect } from 'react';

function App() {
  const [serverMessage, setServerMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const serverMessage = await (await fetch(`${process.env.REACT_APP_API_BASE}`)).text();
      setServerMessage(serverMessage);
    }
    fetchData();
  }, [])

  return (
    <>
      {!serverMessage ? 'Loading...' : (
        <>
          Server said: “{serverMessage}”<br />
          (This is a real message from the live API server! Check the network developer panel!)
        </>
      )}
    </>
  );
}

export default App;
