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
  faHeart,
  faBan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import labelStrings from './labels';

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
  faHeart,
  faBan,
);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.mixin({
  data() {
    return {
      labelStrings,
    };
  },
});

new Vue({
  render: h => h(Main)
}).$mount('#root');
