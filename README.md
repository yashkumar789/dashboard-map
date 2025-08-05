# 🌍 Weather-Aware Map Dashboard

An interactive weather dashboard built using Next.js and Leaflet, enabling users to draw polygons on a map, fetch historical temperature data, and color polygons based on rules.

## 🔗 Live Demo
[View Deployed App on Netlify](https://stately-melba-59bcd6.netlify.app/)

---

## 🚀 Setup & Run Instructions

```bash
# Clone the repository
git clone https://github.com/yashkumar789/dashboard-map
cd dashboard-map

# Install dependencies
npm install --legacy-peer-deps

# Run development server
npm run dev

# Build for production
npm run build
```

---

## 💻 Tech Stack

| Category         | Stack                      |
|------------------|-----------------------------|
| Frontend         | React, Next.js              |
| Mapping          | Leaflet, React-Leaflet      |
| Drawing Tool     | Leaflet-Draw                |
| Styling          | Material UI (MUI)           |
| Deployment       | Netlify                     |
| Geospatial Logic | Turf.js                     |
| Data Source      | Open-Meteo API              |

---

## 📦 Libraries Used

- **react** – Base UI library
- **next** – React framework for hybrid rendering
- **leaflet** – Open-source map rendering
- **react-leaflet** – React bindings for Leaflet
- **react-leaflet-draw** – Drawing polygons on maps
- **@turf/turf** – Geospatial calculations
- **@mui/material** – UI components
- **@mui/icons-material** – Material UI icons
- **leaflet-draw** – Drawing plugin for Leaflet
- **open-meteo API** – Weather data API

---

## 🎨 Design & Development Notes

- **Validation**: Polygon must contain 3–12 points; enforced via `handleCreated()`.
- **Styling**: MUI is used for responsive layout and component styling.
- **Dynamic Coloring**: Based on user-defined rules matched with average temperature values.
- **Data Fetching**: Uses Open-Meteo API to fetch historical hourly temperature data based on polygon centroids.
- **Centroid Calculation**: Utilizes Turf.js to compute polygon centroid accurately.

---

## ✍️ Author

**Yash Kumar**  
🔗 [LinkedIn](www.linkedin.com/in/yash-kumar-67999b231)

---

## 📄 License

This project is licensed under the MIT License.