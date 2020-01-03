<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-12">
        <tab-selector @tab-selected="selectedTabId = $event" />
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <button class="btn btn-primary" @click="togglePlay">{{ state.isPlaying ? "Pause" : "Play" }}</button>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @typedef {Object} CONTROLS_TYPE
 * @property {Boolean} index
 * @property {Boolean} next
 * @property {Boolean} prev
 * @property {Boolean} shuffle
 * @property {Boolean} repeat
 * @property {Boolean} like
 * @property {Boolean} dislike
 */
/**
 * @typedef {Object} STATE_TYPE
 * @property {Boolean} isPlaying
 * @property {CONTROLS_TYPE} controls
 */
/**
 * @typedef {Object} STATE
 * @property {STATE_TYPE} state
 */

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'bootstrap/dist/css/bootstrap-reboot.min.css';
import TabSelector from './TabSelector.vue';

export default {
  name: 'Main',
  components: { TabSelector },

  data() {
    return {
      selectedTabId: null,
      /** @type {STATE} */
      state: {}
    };
  },

  created() {
    browser.runtime.onMessage.addListener(this.tabEventHandler);
  },

  methods: {
    togglePlay() {
      this.sendMessage('play');
    },

    sendMessage(message) {
      if (this.selectedTabId > 0) {
        browser.tabs.sendMessage(this.selectedTabId, message);
      }
    },
    tabEventHandler(message) {
      if (message.state) {
        this.state = message.state;
      }
    }
  }
};
</script>
