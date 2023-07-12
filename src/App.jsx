import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import ToDo from "./component/ToDo";
import SaveCityForm from "./component/SaveCityForm";
// import { useGeolocated } from "react-geolocated";

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  // массив для хранения городов
  const [todos, setTodos] = useState([]);

  // для поиска погоды по городу
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=ba2320d010c5fbf82600343aabd04822`;

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      axios.get(url).then((response) => {
        setData(response.data);
        // console.log(response.data);
      });
      setLocation("");
    }
  };

  // поиск координат пользователя
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords);
      console.log(navigator.geolocation);
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
  }, []);

  // добавление города
  const addCity = (userInput) => {
    if(userInput) {
      const newItem = {
        id: Math.random().toString(36).substring(2,9),
        task:userInput
      }
      setTodos([...todos, newItem])
    }
  }

    // удаление города
  const removeCity = (id) => {
    setTodos([...todos.filter((todo) => todo.id !== id)])
  }



  return (
    <>
      <div className="App">
        <div className="search">
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            onKeyDown={searchLocation}
            placeholder="Enter Location"
            type="search"
          />
          {/* <button
            onChange={(event) => setLocation(event.target.value)}
            onClick={searchLocation}
          >
            Поиск погоды
          </button> */}
        </div>
        <div className="container">
          <div className="top">
            <div className="location">
              <p>{data.name}</p>
            </div>
            <div className="temp">
              {data.weather ? <p>{data.main.temp.toFixed()}</p> : null}
            </div>
            <div className="position"></div>
          </div>
        </div>

        <SaveCityForm addCity={addCity} />
        {todos.map((todo) => {
          return (
            <ToDo 
            todo={todo}
            removeCity={removeCity}
            key={todo.id}
            />
          )
        })}
      </div>
    </>
  );
}

export default App;
