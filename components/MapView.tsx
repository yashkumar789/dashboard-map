import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, FeatureGroup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import { EditControl } from 'react-leaflet-draw';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

interface Rule {
  operator: '<' | '>' | '<=' | '>=' | '=';
  value: string;
  color: string;
}

interface MapViewProps {
  timeRange: number[];
  rules: Rule[];
}

const getPolygonCentroid = (latlngs: LatLngExpression[]): { lat: number; lng: number } => {
  const coords = latlngs.map((point) => {
    const latlng = L.latLng(point); // normalize to LatLng object
    return [latlng.lng, latlng.lat]; // GeoJSON format
  });

  const polygon = turf.polygon([[...coords, coords[0]]]); // close the ring
  const centroid = turf.centroid(polygon);
  const [lng, lat] = centroid.geometry.coordinates;
  return { lat, lng };
};

const getColorForValue = (value: number, rules: Rule[]): string => {
  for (const rule of rules) {
    const threshold = Number(rule.value);
    switch (rule.operator) {
      case '<': if (value < threshold) return rule.color; break;
      case '>': if (value > threshold) return rule.color; break;
      case '<=': if (value <= threshold) return rule.color; break;
      case '>=': if (value >= threshold) return rule.color; break;
      case '=': if (value === threshold) return rule.color; break;
    }
  }
  return '#888'; // default color
};

const fetchTemperatureData = async (lat: number, lng: number, start: Date, end: Date): Promise<number[]> => {
    // Replace with this enhanced version:
    try {
      const startDate = start.toISOString().split('T')[0];
      const endDate = end.toISOString().split('T')[0];
      const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${startDate}&end_date=${endDate}&hourly=temperature_2m`;
  
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch temperature");
  
      const data = await res.json();
      return data.hourly?.temperature_2m || [];
    } catch (error) {
      console.error("API Error:", error);
      return [];
    }
  };  

const MapEvents = ({ timeRange, rules }: MapViewProps) => {
  const map = useMap();

  useEffect(() => {
    map.setZoom(13); // Approx. 2 sq. km view
  }, [map]);

  useEffect(() => {
    const leafletMap = map as any; // Override typing
  
    const layers = Object.values(leafletMap._layers).filter((layer: any) =>
      layer instanceof L.Polygon && layer.getLatLngs
    );
  
    layers.forEach(async (layer: any) => {
      const latlngs = layer.getLatLngs()[0];
      if (!latlngs || latlngs.length < 3) return;
  
      const { lat, lng } = getPolygonCentroid(latlngs);
  
      const now = new Date();
      const start = new Date(now);
      start.setHours(now.getHours() - (720 - timeRange[0]));
      const end = new Date(now);
      end.setHours(now.getHours() - (720 - timeRange[1]));
  
      const tempValues = await fetchTemperatureData(lat, lng, start, end);
      const avgTemp = tempValues.length > 0
        ? tempValues.reduce((a, b) => a + b, 0) / tempValues.length
        : 0;
  
      const color = getColorForValue(avgTemp, rules);
      layer.setStyle({ color });
    });
  }, [timeRange, rules, map]);
  
  
  const handleCreated = async (e: any) => {
    const layer = e.layer;
    const latlngs = layer.getLatLngs()[0];

    // Validate point count
    if (latlngs.length < 3 || latlngs.length > 12) {
      alert('Polygon must have between 3 and 12 points.');
      map.removeLayer(layer);
      return;
    }

    const { lat, lng } = getPolygonCentroid(latlngs);

    const now = new Date();
    const start = new Date(now);
    start.setHours(now.getHours() - (720 - timeRange[0]));
    const end = new Date(now);
    end.setHours(now.getHours() - (720 - timeRange[1]));

    const tempValues = await fetchTemperatureData(lat, lng, start, end);
    const avgTemp =
      tempValues.length > 0
        ? tempValues.reduce((a, b) => a + b, 0) / tempValues.length
        : 0;

    const color = getColorForValue(avgTemp, rules);
    layer.setStyle({ color });
    layer.addTo(map);
  };

  return (
    <EditControl
      position="topright"
      onCreated={handleCreated}
      draw={{
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: false,
        polyline: false,
        polygon: {
          allowIntersection: false,
          showArea: true,
        },
      }}
    />
  );
};

const MapView = ({ timeRange, rules }: MapViewProps) => {
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  return (
    <MapContainer
      center={[22.9734, 78.6569]} // Centered on India
      zoom={13}
      style={{
        height: '100%',
        width: '100%',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <FeatureGroup ref={featureGroupRef}>
        <MapEvents timeRange={timeRange} rules={rules} />
      </FeatureGroup>
    </MapContainer>
  );
};

export default MapView;