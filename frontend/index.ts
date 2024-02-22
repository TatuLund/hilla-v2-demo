import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('outlet')!);

const element = createElement(App);
root.render(element);

// document.documentElement.setAttribute('theme', 'dark');
