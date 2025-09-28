import './assets/styles/base.css';
import Header from './components/Header.js';
import Sidebar from './components/Sidebar.js';
import AppGrid from './components/AppGrid.js';
import SocialMedia from './components/SocialMedia.js';
import Footer from './components/Footer.js';
import { startClock } from './utils/clock.js';
import { initSearch } from './utils/search.js';

const root = document.getElementById('root');

// layout container
const appShell = document.createElement('div');
appShell.className = 'app-shell';

appShell.appendChild(Header());
appShell.appendChild(Sidebar());
// main content wrapper
const main = document.createElement('main');
main.className = 'main-content';
main.appendChild(AppGrid());
main.appendChild(SocialMedia());
main.appendChild(Footer());

appShell.appendChild(main);
root.appendChild(appShell);

// utils
startClock();
initSearch();
