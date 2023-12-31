import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { v4 } from "uuid";
// import { useGeolocated } from "react-geolocated";

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  // помещение в localStorage
  const [items, setItems] = useState(
    JSON.parse(localStorage.getItem("items")) || []
  );
  // геолокация
  const [details, setDatails] = useState(null);
  // доп функции
  const [checkedTime, setCheckedTime] = useState(false);
  const [checkedLon, setCheckedLon] = useState(false);
  const [checkedLat, setCheckedLat] = useState(false);

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

  const searchLocationFromCity = (item) => {
    setLocation(item);
    // setLocation("");
  };

  useEffect(() => {
    axios.get(url).then((response) => {
      setData(response.data);
    });
  }, [location]);
  // поиск города по геолокации
  const getUserGeolocation = () => {
    fetch(
      "https://geolocation-db.com/json/f2e84010-e1e9-11ed-b2f8-6b70106be3c8"
    )
      .then((response) => response.json())
      .then((data) => setDatails(data));
    console.log(data.name);
  };

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  const newItem = () => {
    if (data.name.trim() !== "") {
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
        <div className="user-city">
          <div className="search">
            <input
              className="find"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              onKeyDown={searchLocation}
              placeholder="Enter Location"
              type="text"
            />

            <div className="coordination" onClick={getUserGeolocation}>
              <img src="/public/img/location.svg" alt="" />
            </div>
          </div>

          {details && (
            <div className="userLocation">City: {`${details.city}`}</div>
          )}
        </div>

        <div className="wrapper">
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
                <div className="fav-city" key={item.id}>
                  <div className="city-wrap">
                    <p
                      onClick={() => {
                        searchLocationFromCity(item.item);
                      }}
                    >{`${item.item}`}</p>
                    <button className="btn" onClick={() => deleteCity(item.id)}>
                      ☓
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {data.name != undefined && (
            <>
              <div className="bottom">
                <button className="save bold" onClick={newItem}>
                  Save city
                </button>
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

              <div className="bottom">
                <div className="additional-functions">
                  <div className="row flex items-center">
                    <input
                      type="checkbox"
                      checked={checkedTime}
                      name="time"
                      onChange={() => setCheckedTime(!checkedTime)}
                      className="w-4 h-4 mr-1"
                    />
                    <p>
                      <label for="time">Timezone</label>
                    </p>
                  </div>

                  <p className="bold">{checkedTime ? data.timezone : null}</p>
                </div>

                <div className="additional-functions ">
                  <div className="row flex items-center">
                    <input
                      type="checkbox"
                      checked={checkedLon}
                      name="longitude"
                      onChange={() => setCheckedLon(!checkedLon)}
                      className="w-4 h-4 mr-1"
                    />
                    <p>
                      <label for="longitude">Longitude</label>
                    </p>
                  </div>

                  <p className="bold">{checkedLon ? data.coord.lon : null}</p>
                </div>

                <div className="additional-functions">
                  <div className="row flex items-center">
                    <input
                      type="checkbox"
                      checked={checkedLat}
                      name="latitude"
                      onChange={() => setCheckedLat(!checkedLat)}
                      className="w-4 h-4 mr-1"
                    />
                    <p>
                      <label for="latitude">
                        Latitude</label>
                    </p>
                  </div>

                  <p className="bold">{checkedLat ? data.coord.lat : null}</p>
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
