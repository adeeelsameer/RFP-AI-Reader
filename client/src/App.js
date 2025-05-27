import React, { useState, useEffect, use } from "react";

function App() {
  const [data, setData] = useState([{}]);

  useEffect(() => {
    fetch("/members")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  return (
    <div>
      <h1>Welcome to the React App</h1>
      <p>This is a simple React application.</p>
      <p>Feel free to explore and modify the code!</p>
    </div>
  );
}

export default App;
