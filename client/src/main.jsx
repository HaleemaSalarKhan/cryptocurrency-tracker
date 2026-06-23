import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip
} from 'chart.js';
import App from './App.jsx';
import './styles.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, TimeScale, Filler, Tooltip, Legend);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
