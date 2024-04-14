import React, {useEffect, useRef, useState} from 'react';
import {Wrapper} from "@googlemaps/react-wrapper";
import {useDeepCompareEffectForMaps} from "./hooks/useDeepCompareEffectForMaps";

const App = () => {
    const [markerPos, setMarkerPos] = useState({lat: 1, lng: 1});
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

    console.log(addresses)

    function handleChangeAddress({target}) {
        setAddress(target.value);
    }

    function setPosition({latLng}) {
        setMarkerPos({
            lat: latLng.lat(),
            lng: latLng.lng(),
        })
        setCoordValues({
            lat: latLng.lat(),
            lng: latLng.lng(),
        })
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
                            <li style={{cursor: 'pointer'}}
                                onClick={() => {
                                    setAddress(item.formatted_address);
                                    setMarkerPos({
                                        lat: item.geometry.location.lat(),
                                        lng: item.geometry.location.lng(),
                                    })
                                    setCoordValues(prev => ({
                                        lat: item.geometry.location.lat(),
                                        lng: item.geometry.location.lng(),
                                    }))
                                }}
                            >
                                {item.formatted_address}
                            </li>)}
                    </ul>}
            </div>

        </>

    )
};
const Map = ({setPosition, coordValues, setCoordValues, address, setAddress, setAddresses, children}) => {
    const ref = useRef(null);

    const [map, setMap] = useState();
    const [zoom, setZoom] = useState(15);
    const [coords, setCoords] = useState({
        lat: 0,
        lng: 0,
    });

    async function getCoordsByAddress(address) {
        try {
            const {results} = await geocodeRequest(address);
            if (results) setAddresses(results);
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (coords.lat && coords.lng) {
            setAddressByCoord({...coords});
        }

        async function setAddressByCoord(params = {}) {
            try {
                const response = await geocodeRequest({
                    location: {...params},
                });
                if (response) setAddress(response.results[0].formatted_address);
                console.log('by-coord')

            } catch (err) {
                console.log(err);
            }
        }
    }, [coords]);

    async function geocodeRequest(params) {
        const geocoder = new window.google.maps.Geocoder;
        return await geocoder.geocode(params);
    }

    useEffect(() => {
        if (!address) return setAddresses([]);
        getCoordsByAddress({address});
    }, [address]);

    useEffect(() => {
        setCoords({
            lat: parseFloat(coordValues.lat),
            lng: parseFloat(coordValues.lng),
        })
    }, [coordValues]);
    useEffect(() => {
        if (ref.current && !map)
            setMap(new window.google.maps.Map(ref.current, {}));

    }, [ref, map]);
    useDeepCompareEffectForMaps(() => {
        if (map) map.setOptions({
            zoom,
            center: {...coords}
        });
    }, [map, coords]);

    useEffect(() => {
        if (map) {
            ["click", "idle"].forEach((eventName) =>
                google.maps.event.clearListeners(map, eventName)
            );
            map.addListener("click", (event) => {
                setPosition(event);
                setZoom(map.zoom);
            });
        }
    }, [map]);

    return (
        <div style={{display: 'flex', gap: '10px', alignItems: 'start'}} className="app">
            <div ref={ref}
                 style={{height: '70vh', width: '100vw'}}/>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, {map});
                }
            })}
        </div>
    )
}


const Marker = (options) => {
    const [marker, setMarker] = useState();

    useEffect(() => {
        if (!marker) {
            setMarker(new google.maps.Marker());
        }

        // remove marker from map on unmount
        return () => {
            if (marker) {
                marker.setMap(null);
            }
        };
    }, [marker]);

    useEffect(() => {
        if (marker) {
            marker.setOptions(options);
        }
    }, [marker, options]);

    return null;
};
export default App;