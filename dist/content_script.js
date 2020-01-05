(function() {
  browser.runtime.sendMessage({ state: getState() });

  if (window.injected) {
    return;
  }

  window.injected = true;

  async function commandHandler(message) {
    const externalAPI = window.wrappedJSObject.externalAPI;
    switch (message) {
      case 'play':
        await externalAPI.togglePause();
        break;
      case 'play-next':
        await externalAPI.next();
        break;
      case 'play-previous':
        await externalAPI.prev();
        break;
    }

    browser.runtime.sendMessage({ state: getState() });
  }

  function getState() {
    const externalAPI = window.wrappedJSObject.externalAPI;
    const currentTrack = externalAPI.getCurrentTrack();

    return {
      isPlaying: externalAPI.isPlaying(),
      controls: externalAPI.getControls(),
      currentTrack: {
        title: currentTrack.title,
        artists: [...currentTrack.artists].map(artist => artist.title)
      }
    };
  }

  browser.runtime.onMessage.addListener(commandHandler);
})();
