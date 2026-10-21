import { createRoot } from 'react-dom/client';
import Preview from './App';
import '../src/styles.css';
import './preview.css';

createRoot(document.getElementById('root')!).render(<Preview />);
