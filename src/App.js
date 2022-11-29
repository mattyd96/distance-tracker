import { useState, useRef } from 'react';
import './App.css';

function App() {
  const interval = useRef(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [tracking, setTracking] = useState(false);
  const [lastLatitude, setLastLatitude] = useState(null);
  const [lastLongitude, setLastLongitude] = useState(null);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c; // in metres
    return d;
  }

  const handleStart = () => {
    let lastLon, lastLat;
    setTracking(true);
    interval.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(data => {
        if(lastLon && lastLat) {
          setTotalDistance(prevState => prevState + calculateDistance(lastLat, lastLon, data.coords.latitude, data.coords.longitude));
        }
        lastLat = data.coords.latitude;
        lastLon = data.coords.longitude;
        setLastLatitude(lastLat);
        setLastLongitude(lastLon);
      })
    },1000)
  };

  const handleEnd = () => {
    setTracking(false);
    clearInterval(interval.current);
  }

  const handleReset = () => {
    setTotalDistance(0)
    setLastLatitude(null);
    setLastLongitude(null);
  }
  return (
    <div className="App">
      <p>Your total distance is { totalDistance } metres</p>
      <button onClick={handleStart}>Start Distance Tracking</button>
      <button onClick={handleEnd}>Stop Distance Tracking</button>
      <button onClick={handleReset}>Reset Distance</button>
      {tracking ? <p>Tracking</p> : <p>Not tracking</p>}
      {lastLatitude ? <p>Last Lat: {lastLatitude}</p> : ''}
      {lastLongitude ? <p>Last Lon: {lastLongitude}</p>: ''}
    </div>
  );
}

export default App;
