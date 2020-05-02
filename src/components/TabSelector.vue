<template>
  <div v-if="selectedTabId !== undefined" class="is-flex">
    <div class="select is-small max-width">
      <select
        class="max-width"
        @change="selectTab($event.target.value)"
      >
        <option
          v-for="tab in tabs"
          :key="tab.id"
          :value="tab.id"
          :selected="selectedTabId === tab.id"
        >{{ tab.title }}</option>
      </select>
    </div>
    <button
      :title="labelStrings.switch_tab"
      :class="['button', 'is-white', 'is-small']"
      :disabled="selectedTabId === undefined"
      style="margin-left: 3px;"
      @click="showTab"
    >
      <font-awesome-icon
        icon="external-link-alt"
      />
    </button>
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
    };
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
        await browser.storage.local.set({ selectedTabId: this.selectedTabId });

        this.$emit('tab-selected', this.selectedTabId);
      }
    },
    showTab() {
      if (this.selectedTabId) {
        browser.tabs.update(this.selectedTabId, { active: true });
      }
    },
  }
};
</script>

<style scoped>
.max-width {
  width: 100%;
}
</style>
