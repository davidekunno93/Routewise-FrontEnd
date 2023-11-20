import { Icon, tileLayer } from 'leaflet'
import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvent } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'

export const OpenMap = ({ mapCenter, markers, zoom }) => {
    const [mapGeo, setMapGeo] = useState(mapCenter ? mapCenter : [51.5072, -0.1276])
    // const [markers, setMarkers] = useState(locations ? locations : [])
    // markers is a list of objects > { geocode: [lat, lon], popUp: "say soomething"}
    const tileLayer = 'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png'

    const pinIcon = new Icon({
        iconUrl: "https://i.imgur.com/ukt1lYj.png",
        iconSize: [46, 41]
    })

    // useEffect(() => {
    //     if (mapCenter) {
    //         ChangeView(mapCenter[0], mapCenter[1])
    //     }
    // }, [mapCenter])
    // const ChangeView = (lat, lon) => {
    //     const map = useMapEvent('click', () => {
    //         map.panTo([lat, lon], map.getZoom())
    //     })
    //     return null
    // }

    // const updateCenter = () => {
    //     map.leafletElemen
    // }
    const test = () => {
        console.log(markers)
    }
    // console.log(markers)

    return (
        <>
            {/* <div className="mapBox"> */}


            <MapContainer center={mapGeo} zoom={zoom ? zoom : 10} >
                <TileLayer attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url={tileLayer} />
                {/* <ChangeView /> */}
                <MarkerClusterGroup maxClusterRadius={10}>
                    {markers && markers.length > 0 ? markers.map((marker, i) => (
                        <Marker key={i} position={marker.geocode} icon={pinIcon}>
                            <Popup>{marker.placeName}</Popup>
                        </Marker>
                    )) : null
                    }
                </MarkerClusterGroup>
            </MapContainer>



            {/* </div> */}

        </>
    )
}
