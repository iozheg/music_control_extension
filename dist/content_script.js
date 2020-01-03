(function() {
  browser.runtime.sendMessage({ state: getState() });

  if (window.injected) {
    return;
  }

  window.injected = true;

  function commandHandler(message) {
    const externalAPI = window.wrappedJSObject.externalAPI;
    if (message === 'play') {
      externalAPI.togglePause();
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
