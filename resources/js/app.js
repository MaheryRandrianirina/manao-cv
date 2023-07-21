import './bootstrap';
import {ScrollIfErrors} from './auth';

import Alpine from 'alpinejs';
import Interactions from './interactions';
import CVModels from './cv';

window.Alpine = Alpine;

Alpine.start();

ScrollIfErrors();

new Interactions();

const cvModel = new CVModels();
cvModel.createCVForm();
