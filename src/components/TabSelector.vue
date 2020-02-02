<template>
  <div
    :class="['dropdown columns is-mobile', showTabs ? 'is-active' : '']"
    @click="showTabs = !showTabs"
  >
    <div class="dropdown-trigger column is-3 is-vcentered">
      <div class="">
        <button
          class="button is-small"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
        >
          <span>Tab</span>
          <span class="icon is-small">
            <i class="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </button>
      </div>
    </div>
    <div class="column is-8 is-vcentered tab-name">
      <span class="is-size-7">{{ selectedTab ? selectedTab.title : '' }}</span>
    </div>

    <div class="dropdown-menu" id="dropdown-menu" role="menu">
      <div class="dropdown-content">
        <a
          href="#"
          class="dropdown-item is-small is-size-7"
          v-for="tab in tabs"
          :key="tab.id"
          @click="selectTab(tab.id)"
        >
          {{ tab.id }} - {{ tab.title }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabSelector',

  data() {
    return {
      tabs: [],
      url: 'music.yandex',
      selectedTabId: undefined,
      showTabs: false
    };
  },
  computed: {
    selectedTab() {
      return this.tabs.find(tab => tab.id === this.selectedTabId);
    }
  },

  async mounted() {
    const storedTabId = await this.getStoredId();

    browser.tabs.query({ currentWindow: true }).then(async tabs => {
      this.tabs = tabs.filter(tab => tab.url.includes(this.url));

      let tabId = null;
      if (storedTabId > 0) {
        const preselectedTab = this.tabs.find(tab => tab.id === storedTabId);
        tabId = preselectedTab ? storedTabId : null;
      }

      tabId = tabId === null && this.tabs[0] ? this.tabs[0].id : tabId;

      if (tabId) {
        this.selectTab(tabId);
      }
    });
  },

  methods: {
    async getStoredId() {
      const storedTabId = await browser.storage.local.get('selectedTabId');
      return storedTabId ? storedTabId.selectedTabId : null;
    },
    async selectTab(value) {
      this.selectedTabId = Number(value);
      if (!isNaN(this.selectedTabId)) {
        await browser.tabs.executeScript(this.selectedTabId, {
          file: '/content_script.js'
        });
        await browser.storage.local.set({ selectedTabId: this.selectedTabId });

        this.$emit('tab-selected', this.selectedTabId);
      }
    }
  }
};
</script>

<style scoped>
.tab-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
