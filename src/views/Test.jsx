import React from 'react'
import { Loading } from '../components/Loading'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import { Draggable, Icon } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { DragDropContext } from 'react-beautiful-dnd';
import { Column } from '../components/Column';

export const Test = () => {

    // map stuff
    const markers = [
        {
            geocode: [48.86, 2.3522],
            popUp: "First Marker"
        },
        {
            geocode: [48.85, 2.3522],
            popUp: "Second Marker"
        },
        {
            geocode: [48.855, 2.3522],
            popUp: "Third Marker"
        },
        {
            geocode: [48.865, 2.3522],
            popUp: "Fourth Marker"
        },
    ]
    const pinIcon = new Icon({
        iconUrl: "https://i.imgur.com/ukt1lYj.png",
        iconSize: [46, 41]
    })
    const parisGeo = [48.8566, 2.3522]
    const tile1 = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
    const tile2 = 'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png'
    const tiles = ["http://a.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png", "http://b.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png", "http://c.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png"]
    
    
    // drag n drop
    const initialData = {
        places: {
          1: { id: 1, placeName: "", info: "", address: "", imgUrl: "" },
          2: { id: 2, placeName: "", info: "", address: "", imgUrl: "" },
          3: { id: 3, placeName: "", info: "", address: "", imgUrl: "" },
          4: { id: 4, placeName: "", info: "", address: "", imgUrl: "" },
          5: { id: 5, placeName: "", info: "", address: "", imgUrl: "" },
          6: { id: 6, placeName: "", info: "", address: "", imgUrl: "" }
        },
        days: {
          "day-1": {
            day: "Monday",
            date: "11/27",
            places: []
          },
          "day-2": {
            day: "Tuesday",
            date: "11/28",
            places: []
          },
          "day-3": {
            day: "Wednesday",
            date: "11/29",
            places: []
          },
          // for reordering of days
          dayOrder: ["day-1", "day-2", "day-3"]
        }
      }
    
    
    
    
    const onDragEnd = (result) => {
        const { destination, source } = result
    }
    
    return (
        <>
            <p className="">Test Page</p>

            <DragDropContext>

                <div className="page-container90 flx-r">
                    <Column />
                    <div className="flx-c flx-1 mx-5 seven">

                    </div>
                    <div className="flx-c flx-1 nine">

                    </div>
                </div>


            </DragDropContext>

















            {/* <MapContainer center={parisGeo} zoom={13}>
                <TileLayer
                    attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url={tile2}
                />
                <MarkerClusterGroup chunkedLoading >
                    {markers.map(marker => (
                        <Marker position={marker.geocode} icon={pinIcon}>
                            <Popup>{marker.popUp}</Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
            </MapContainer> */}






            <div className="empty-6"></div>
            <div className="empty-6"></div>
            <div className="empty-6"></div>

        </>
    )
}
