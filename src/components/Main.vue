<template>
  <div class="container">
    <div class="columns is-mobile">
      <div class="column is-8 is-offset-1">
        <tab-selector @tab-selected="tabSelected" />
      </div>
      <div
        v-if="isRadio"
        class="column is-2 is-vcentered is-size-7"
      >
        <span>Radio</span>
      </div>
    </div>
    <div class="columns is-mobile track-name-row">
      <div v-if="currentTrack" class="column is-10 is-offset-1">
        <div class="track-name is-size-4">{{ currentTrack.title }}</div>
        <div class="track-artist is-size-7 has-text-grey">{{ currentTrack.artists.join(',') }}</div>
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

    <div class="columns is-mobile options-control">
      <div class="column is-6 is-offset-1">
        <button
          :class="['button', 'is-white', visibleTrackList && 'is-active']"
          :disabled="emptyTrackList"
          @click="showTrackList"
        >
          <font-awesome-icon
            icon="list"
          />
        </button>
      </div>
      <div class="column is-4">
        <volume-control
          :volume-level="volumeLevel"
          @change-volume="changeVolume"
          @toggle-mute="toggleMute"
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
          :current-track-link="currentTrack.link"
          :is-playing="state.isPlaying"
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
 * @property {Object} currentTrack
 * @property {String} sourceType
 */
/**
 * @typedef {Object} STATE
 * @property {STATE_TYPE} state
 */
/**
 * @typedef {Object} TRACK_LIST_ITEM
 * @property {String} list
 * @property {String} title
 * @property {String[]} artists
 */

import 'bulma/css/bulma.css';
import TabSelector from './TabSelector.vue';
import PlayControl from './PlayControl.vue';
import TrackList from './TrackList.vue';
import VolumeControl from './VolumeControl.vue';

export default {
  name: 'Main',
  components: { TabSelector, PlayControl, TrackList, VolumeControl },

  data() {
    return {
      selectedTabId: null,
      /** @type {STATE} */
      state: {},
      loading: false,
      /** @type {TRACK_LIST_ITEM[]} */
      trackList: [],
      visibleTrackList: false,
      volumeLevel: 50,
    };
  },
  computed: {
    isRadio() {
      return this.state.sourceType === 'radio';
    },
    currentTrack() {
      return this.state.currentTrack;
    },
    emptyTrackList() {
      return !this.trackList;
    },
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
    tabEventHandler(message, sender) {
      this.loading = false;
      if (!sender.tab || sender.tab.id !== this.selectedTabId) return;

      if (message.state) {
        this.state = message.state;
      }
      if (message.trackList) {
        this.trackList = message.trackList;
      }
      if (message.volumeLevel >= 0) {
        this.volumeLevel = message.volumeLevel;
      }
    },

    async tabSelected(newTabId) {
      this.selectedTabId = newTabId;
      await browser.tabs.executeScript(this.selectedTabId, {
        file: '/content_script.js'
      });
    },
    showTrackList() {
      this.visibleTrackList = !this.visibleTrackList;
      this.sendMessage({ command: 'get-track-list' });
    },

    changeVolume(level) {
      this.sendMessage({ command: 'change-volume', params: { level } });
    },
    toggleMute() {
      this.sendMessage({ command: 'toggle-mute' });
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

<style src="../styles/icon-button.css"></style>