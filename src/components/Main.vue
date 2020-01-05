<template>
  <div class="container">
    <div class="columns is-mobile">
      <div class="column is-10 is-offset-1 is-vcentered">
        <tab-selector @tab-selected="selectedTabId = $event" />
      </div>
    </div>
    <div class="columns is-mobile">
      <div v-if="state.currentTrack" class="column is-10 is-offset-1">
        <div class="track-name is-size-4">{{ state.currentTrack.title }}</div>
        <div class="track-artist is-size-7 has-text-grey">
          {{ state.currentTrack.artists.join(',') }}
        </div>
        <progress
          v-show="loading"
          class="progress is-small process-indication"
          max="100"
        ></progress>
        <div v-show="!loading" class="process-indication"></div>
      </div>
    </div>
    <div class="columns is-mobile is-vcentered is-centered">
      <div class="column is-2 has-text-centered">
        <font-awesome-icon
          :class="[
            'icon-button',
            !previousTrackAvaliable ? 'icon-button_disabled' : ''
          ]"
          icon="fast-backward"
          @click="playPrevious"
          size="2x"
        />
      </div>
      <div class="column is-2 has-text-centered">
        <font-awesome-icon
          class="icon-button"
          :icon="state.isPlaying ? 'pause' : 'play'"
          @click="togglePlay"
          size="3x"
        />
      </div>
      <div class="column is-2 has-text-centered">
        <font-awesome-icon
          class="icon-button"
          icon="fast-forward"
          @click="playNext"
          size="2x"
        />
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

import 'bulma/css/bulma.css';
import TabSelector from './TabSelector.vue';

export default {
  name: 'Main',
  components: { TabSelector },

  data() {
    return {
      selectedTabId: null,
      /** @type {STATE} */
      state: {},
      loading: false
    };
  },
  computed: {
    previousTrackAvaliable() {
      return this.state.controls ? this.state.controls.prev !== null : true;
    }
  },

  created() {
    browser.runtime.onMessage.addListener(this.tabEventHandler);
  },

  methods: {
    togglePlay() {
      this.sendMessage('play');
    },
    playNext() {
      this.loading = true;
      this.sendMessage('play-next');
    },
    playPrevious() {
      this.loading = true;
      if (this.previousTrackAvaliable) {
        this.sendMessage('play-previous');
      }
    },

    sendMessage(message) {
      if (this.selectedTabId > 0) {
        browser.tabs.sendMessage(this.selectedTabId, message);
      }
    },
    tabEventHandler(message) {
      this.loading = false;
      if (message.state) {
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
