import Vue from 'vue';
import Main from './components/Main.vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faPlay,
  faPause,
  faFastBackward,
  faFastForward,
  faList,
  faVolumeUp,
  faVolumeMute,
  faRandom,
  faRedo,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(
  faPlay,
  faPause,
  faFastBackward,
  faFastForward,
  faList,
  faVolumeUp,
  faVolumeMute,
  faRandom,
  faRedo,
);

Vue.component('font-awesome-icon', FontAwesomeIcon);

new Vue({
  render: h => h(Main)
}).$mount('#root');
