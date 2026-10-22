import { createRoot } from 'react-dom/client';
import App from './App';
import '../src/styles.css';
import './site.css';
import './editorial.css';
import './keynote.css';
createRoot(document.getElementById('root')!).render(<App />);
