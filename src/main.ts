import { App } from './app';
import { loadSettings } from './storage';
import './styles/style.scss';
import { applyTheme } from './ui';

applyTheme(loadSettings().theme);

const app = new App();
app.start();
