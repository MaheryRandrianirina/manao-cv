import './bootstrap';
import {ScrollIfErrors} from './auth';

import Alpine from 'alpinejs';
import Interactions from './interactions';

window.Alpine = Alpine;

Alpine.start();

ScrollIfErrors();

new Interactions();
