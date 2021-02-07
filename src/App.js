import React, { useEffect, useState, useRef } from 'react'
import './App.css';
import io from "socket.io-client";

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


function App() {
  const [accessToken, setAccessToken] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const socket = useRef(null)
  useEffect(() => {
    // How to handle authentication
    // On APP Error should refresh the accessToken and retry once again
      socket.current =  io('http://localhost:5000/driver', {
        auth: {
          token: accessToken
        },
      })

    return () => {
        // Disconnect if it unmounts
        if(socket.current) socket.current.disconnect()
    }
  }, [])

  const handleLogin = async () => {
    const result = await fetch('http://localhost:5000/api/v1/login/user', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
    })

    const data = await result.json()

    setAccessToken(data.accessToken)
  }

  const handleRandomCoordinates = () => {
    if (socket.current) {
      socket.current.emit('track-order', {driverLocationId: 1, coordinates: [getRandomInt(10), getRandomInt(12)] })
    }
  }

  return (
    <div className="App">
      <input type="email" value={email} placeholder="your email" onChange={event => setEmail(event.target.value)}/>
      <input type="password" value={password} placeholder="your password" onChange={event => setPassword(event.target.value)}/>
      <button type="button" onClick={handleLogin}>login</button>
      <button onClick={handleRandomCoordinates}>send random coordinates</button>
    </div>
  );
}

export default App;
