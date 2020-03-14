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
    <div class="columns is-mobile track-name-row">
      <div v-if="state.currentTrack" class="column is-10 is-offset-1">
        <div class="track-name is-size-4">{{ state.currentTrack.title }}</div>
        <div class="track-artist is-size-7 has-text-grey">{{ state.currentTrack.artists.join(',') }}</div>
        <progress v-show="loading" class="progress is-small process-indication" max="100"></progress>
        <div v-show="!loading" class="process-indication"></div>
      </div>
    </div>

    <div class="columns is-mobile is-vcentered is-centered">
      <div class="column is-4 has-text-centered">
        <play-control
          :state="state"
          @send-message="sendMessage($event, true)"
        />
      </div>
    </div>

    <div class="columns is-mobile is-vcentered options-control">
      <div class="column is-10 is-offset-1">
        <font-awesome-icon
          :class="['icon-button', visibleTrackList && 'icon-button_pressed']"
          icon="list"
          @click="showTrackList"
        />
  </div>
    </div>
    <div
      v-if="visibleTrackList"
      class="columns is-mobile is-vcentered"
    >
      <div class="column is-10 is-offset-1">
        <track-list
          :track-list="trackList"
          @switch-to-track="sendMessage($event, true)"
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
import PlayControl from './PlayControl.vue';
import TrackList from './TrackList.vue';

export default {
  name: 'Main',
  components: { TabSelector, PlayControl, TrackList },

  data() {
    return {
      selectedTabId: null,
      /** @type {STATE} */
      state: {},
      loading: false,
      trackList: [],
      visibleTrackList: false
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
    sendMessage({ command, params }, isAsync = false) {
      if (this.selectedTabId > 0) {
        if (isAsync) this.loading = true;
        browser.tabs.sendMessage(this.selectedTabId, { command, params });
      }
    },
    tabEventHandler(message) {
      this.loading = false;
      if (message.state) {
        this.state = message.state;
      }
      if (message.trackList) {
        this.trackList = message.trackList;
      }
    },

    showTrackList() {
      this.visibleTrackList = !this.visibleTrackList;

      if (this.visibleTrackList) {
        this.sendMessage({ command: 'get-track-list' });
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

.track-name-row {
  background-color: #f7f7f7;
}
.track-name,
.track-artist {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.process-indication {
  height: 0.1rem;
  margin-bottom: 0;
}

.options-control {
  border-top: 1px solid lightgray;
}
</style>

<style>
.icon-button {
  cursor: pointer;
  opacity: 0.7;
}
.icon-button:hover {
  opacity: 1;
}
.icon-button_pressed {
  color: tomato;
  opacity: 1;
}
.icon-button_disabled,
.icon-button_disabled:hover {
  opacity: 0.3;
}
</style>