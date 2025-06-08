import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import VaktAI from '../pages/index';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VaktAI />
  </StrictMode>
);