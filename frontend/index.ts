import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('outlet')!); //.render(createElement(App));

root.render(createElement(App));
