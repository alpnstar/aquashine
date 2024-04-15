import React, {useEffect, useRef, useState} from 'react';
import {Wrapper} from "@googlemaps/react-wrapper";
import {setLatLng} from "./utils/common";
import Marker from "./components/Marker";
import Map from "./components/Map";

const App = () => {
    const [markerPos, setMarkerPos] = useState();
    const render = (status) => {
        return <h1>{status}</h1>;
    };
    const [addresses, setAddresses] = useState([]);
    const [address, setAddress] = useState('');
    const [coordValues, setCoordValues] = useState({
        lat: '43.002395',
        lng: '47.459273',
    });

    function handleChangeCoord({target}) {
        setCoordValues(prev => ({
            ...prev,
            [target.name]: target.value,
        }))
    }

    function handleChangeAddress({target}) {
        setAddress(target.value);
    }

    function setPosition({latLng}) {
        setMarkerPos(setLatLng(latLng.lat(), latLng.lng()))
        setCoordValues(setLatLng(latLng.lat(), latLng.lng()))
        setAddresses([]);

    }

    return (
        <>
            <Wrapper apiKey={"AIzaSyDAbxRYrt3BHfbm79UDudSK-k4eayEiUK8"} render={render}>
                <Map coordValues={coordValues}
                     setCoordValues={setCoordValues}
                     address={address}
                     setAddress={setAddress}
                     setAddresses={setAddresses}
                     setPosition={setPosition}>
                    <Marker position={markerPos}/>
                </Map>
            </Wrapper>
            <div className="coord">
                <input type="text" placeholder="Широта" name="lat" value={coordValues.lat}
                       onChange={handleChangeCoord}/>
                <input type="text" placeholder="Долгота" name="lng" value={coordValues.lng}
                       onChange={handleChangeCoord}/>
                <input type="text" placeholder="Адрес" name="address" value={address}
                       onChange={handleChangeAddress}/>
                {!!addresses.length && !!address &&
                    <ul>
                        {addresses.map(item =>
                            <li key={item} style={{cursor: 'pointer'}}
                                onClick={() => {
                                    setAddress(item.formatted_address);
                                    const {location} = item.geometry;
                                    setMarkerPos(setLatLng(location.lat(), location.lng()))
                                    setCoordValues(setLatLng(location.lat(), location.lng()))
                                }}
                            >
                                {item.formatted_address}
                            </li>)}
                    </ul>}
            </div>

        </>

    )
};


export default App;

