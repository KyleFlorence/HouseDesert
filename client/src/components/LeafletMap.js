import { MapContainer, TileLayer, Marker, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet'
import { Icon } from 'leaflet';
import marker from './icons/marker.png';
import home from './icons/home.png';
import 'leaflet/dist/leaflet.css';

const markerIcon = new Icon({
    iconUrl: marker,
    iconSize: [32,32]
})

const homeIcon = new Icon({
    iconUrl: home,
    iconSize: [32,32]
})

function SetViewOnChange ({data}) {
  // Zoom the map to fit all the markers on mount and prop change
  const map = useMap();
  if (data.length > 0) {
    const bounds = L.latLngBounds((data).map((point) => {
        if (point.lat !== null && point.lng !== null) {
            return ([point.lat, point.lng])
        } else {
            return null
        }
    }));
    map.fitBounds(bounds, {maxZoom:14})
  }
  return null;
}

const LeafletMap = ({ data }) => {
  return (
    <MapContainer className="map" center={[data[0].lat, data[0].lng]} zoom={14}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors" />
      <Marker  key={data[0].name} position={[data[0].lat, data[0].lng]} icon={homeIcon}>
                <Tooltip sticky>
                    <strong>{data[0].name}</strong>
                </Tooltip>
            </Marker>
      { data.slice(1).map((store, i) => {
        if (store.lat === null || store.lng === null) {
            return null
        } else {
            return (
            <Marker  key={i} position={[store.lat, store.lng]} icon={markerIcon}>
                <Tooltip sticky>
                    <div>
                        <strong>{store.name}</strong>
                        <p>{store.time}</p>
                    </div>
                </Tooltip>
            </Marker>
            )
            }
        }
    )}
      <SetViewOnChange data={data}/>
    </MapContainer>
  );
};

export default LeafletMap;