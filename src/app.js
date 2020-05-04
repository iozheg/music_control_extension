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
  faExternalLinkAlt,
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
  faHeart,
  faBan,
  faExternalLinkAlt,
);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.mixin({
  methods: {
    i18n(label) {
      return browser.i18n.getMessage(label);
    }
  }
});

new Vue({
  render: h => h(Main)
}).$mount('#root');
