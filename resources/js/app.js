import './bootstrap';
import {ScrollIfErrors} from './auth';

import Alpine from 'alpinejs';
import InteractionsWithNavbar from './interactions-with-navbar';

window.Alpine = Alpine;

Alpine.start();

ScrollIfErrors();

InteractionsWithNavbar();
