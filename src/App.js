import './App.css';

function App() {
  let locationPing;
  let totalDistance = 0;

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

    locationPing = setInterval(() => {
      navigator.geolocation.getCurrentPosition(data => {
        //console.log(data)
        if(lastLon && lastLat) {
          totalDistance += calculateDistance(lastLat, lastLon, data.coords.latitude, data.coords.longitude);
          console.log(totalDistance)
        }
        lastLat = data.coords.latitude
        lastLon = data.coords.longitude
      })
    },1000)
  };

  const handleEnd = () => {
    if(locationPing) {
      clearInterval(locationPing)
    }
  }
  return (
    <div className="App">
      <p>Your totalDistance is { totalDistance } metres</p>
      <button onClick={handleStart}>Start Distance Tracking</button>
      <button onClick={handleEnd}>Stop Distance Tracking</button>
    </div>
  );
}

export default App;
