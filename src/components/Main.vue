<template>
  <div class="container">
    <div class="columns is-mobile">
      <div class="column is-8 is-offset-1">
        <tab-selector @tab-selected="selectedTabId = $event" />
      </div>
      <div
        v-if="isRadio"
        class="column is-2 is-vcentered is-size-7"
      >
        <span>Radio</span>
      </div>
    </div>
    <div class="columns is-mobile">
      <div v-if="state.currentTrack" class="column is-10 is-offset-1">
        <div class="track-name is-size-4">{{ state.currentTrack.title }}</div>
        <div class="track-artist is-size-7 has-text-grey">{{ state.currentTrack.artists.join(',') }}</div>
        <progress v-show="loading" class="progress is-small process-indication" max="100"></progress>
        <div v-show="!loading" class="process-indication"></div>
      </div>
    </div>
    <play-control
      :state="state"
      @send-message="sendMessage"
    />
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

import 'bulma/css/bulma.css';
import TabSelector from './TabSelector.vue';
import PlayControl from './PlayControl.vue';

export default {
  name: 'Main',
  components: { TabSelector, PlayControl },

  data() {
    return {
      selectedTabId: null,
      /** @type {STATE} */
      state: {},
      loading: false
    };
  },
  computed: {
    isRadio() {
      return this.state.sourceType === 'radio';
    }
  },

  created() {
    browser.runtime.onMessage.addListener(this.tabEventHandler);
  },

  methods: {
    sendMessage(message) {
      if (this.selectedTabId > 0) {
        browser.tabs.sendMessage(this.selectedTabId, message);
      }
    },
    tabEventHandler(message) {
      this.loading = false;
      if (message.state) {
        console.log(message.state);
        this.state = message.state;
      }
    }
  }
};
</script>

<style scoped>
.container {
  width: 500px;
  height: 100%;
  padding: 10px 0;
  overflow: hidden;
  border-radius: 15px;
}

.track-name,
.track-artist {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.icon-button {
  cursor: pointer;
  opacity: 0.7;
}
.icon-button:hover {
  opacity: 1;
}
.icon-button_disabled,
.icon-button_disabled:hover {
  opacity: 0.3;
}

.process-indication {
  height: 0.1rem;
  margin-bottom: 0;
}
</style>
