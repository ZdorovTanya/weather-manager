import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { v4 } from "uuid";
// import { useGeolocated } from "react-geolocated";

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  // сохранение города
  const [item, setItem] = useState("");
  // помещение в localStorage
  const [items, setItems] = useState(
    JSON.parse(localStorage.getItem("items")) || []
  );

  // для поиска погоды по городу
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=ba2320d010c5fbf82600343aabd04822`;

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      axios.get(url).then((response) => {
        setData(response.data);
      });
      setLocation("");
    }
  };

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  const newItem = () => {
    console.log(data.name);
    setItem(data.name);
    if (item.trim() !== "") {
      const newItem = {
        id: v4(),
        item: data.name,
      };
      setItems((items) => [...items, newItem]);
    } else {
      alert("что-то пошло не так");
    }
  };

  const deleteCity = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <>
      <div className="App">
        <div className="search">
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            onKeyDown={searchLocation}
            placeholder="Enter Location"
            type="text"
          />
        </div>

        <div className="container">
          <div className="top">
            <div className="location">
              <p>{data.name}</p>
            </div>
            <div className="temp">
              {data.weather ? <h1>{data.main.temp.toFixed()} ℃</h1> : null}
            </div>
            <div className="description">
              {data.weather ? <p>{data.weather[0].main}</p> : null}
            </div>
          </div>

          <div className="favotire">
            {items.map((item, index) => {
              return (
                <div className="fav-city">
                  <div className="city-wrap">
                    <p>{`${item.item}`}</p>
                    <button className="btn" onClick={() => deleteCity(item.id)}>☓</button>
                  </div>
                </div>
              );
            })}
          </div>

          {data.name != undefined && (
            <>
              <div className="bottom">
                <button className="save bold" onClick={newItem}>Save city</button>
                <div className="feels">
                  {data.main ? (
                    <p className="bold">{data.main.feels_like} ℃</p>
                  ) : null}
                  <p>Feels like</p>
                </div>
                <div className="humidity">
                  {data.main ? (
                    <p className="bold">{data.main.humidity}%</p>
                  ) : null}
                  <p>Humidity</p>
                </div>
                <div className="wind">
                  {data.wind ? (
                    <p className="bold">{data.wind.speed} km/h</p>
                  ) : null}
                  <p>Wind Speed</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
