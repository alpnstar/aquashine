import React, {useEffect, useRef, useState} from "react";
import {setLatLng} from "../../utils/common";
import {useDeepCompareEffectForMaps} from "../../hooks/useDeepCompareEffectForMaps";

const GoogleMapsMap = ({setPosition, coordValues, address, setAddress, setAddresses, className, children}) => {
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
        if (coords.lat && coords.lng)
            setAddressByCoord({...coords});

        async function setAddressByCoord(params = {}) {
            try {
                const response = await geocodeRequest({
                    location: {...params},
                });
                if (response) setAddress(response.results[0].formatted_address);

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
        setCoords(setLatLng(parseFloat(coordValues.lat), parseFloat(coordValues.lng)))
    }, [coordValues]);
    useEffect(() => {
        if (ref.current && !map)
            setMap(new window.google.maps.Map(ref.current, {
                center: {
                    lat: 25.276987,
                    lng: 55.296249,
                },
                disableDefaultUI: true,
            }));

    }, [ref, map]);
    useDeepCompareEffectForMaps(() => {
        if (map) map.setOptions({
            zoom,
            center: {...coords}
        });
    }, [map, coords]);

    useEffect(() => {
        if (map) {
            ["click"].forEach((eventName) =>
                google.maps.event.clearListeners(map, eventName)
            );
            map.addListener("click", (event) => {
                setPosition(event);
                setZoom(map.zoom);
            });
        }
    }, [map]);

    return (
        <>
            <div className={className} ref={ref}/>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, {map});
                }
            })}
        </>
    )
}
export default GoogleMapsMap;