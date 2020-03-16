(function() {
  browser.runtime.sendMessage({ state: getState() });

  if (window.injected) {
    return;
  }

  window.injected = true;

  async function commandHandler({ command, params }) {
    const externalAPI = window.wrappedJSObject.externalAPI;
    let response;

    switch (command) {
      case 'play':
        await externalAPI.togglePause();
        response = { state: getState() };
        break;
      case 'play-next':
        await externalAPI.next();
        response = { state: getState() };
        break;
      case 'play-previous':
        await externalAPI.prev();
        response = { state: getState() };
        break;
      case 'get-track-list':
        response = { trackList: getTrackList() };
        break;
      case 'switch-to-track':
        await externalAPI.play(params.index);
        response = {
          state: getState(),
          trackList: getTrackList()
        };
    }

    browser.runtime.sendMessage(response);
  }

  function getState() {
    const externalAPI = window.wrappedJSObject.externalAPI;
    const currentTrack = externalAPI.getCurrentTrack();
    const sourceInfo = externalAPI.getSourceInfo();

    return {
      isPlaying: externalAPI.isPlaying(),
      controls: externalAPI.getControls(),
      currentTrack: {
        title: currentTrack.title,
        artists: [...currentTrack.artists].map(artist => artist.title),
        link: currentTrack.link
      },
      trackList: getTrackList(),
      sourceType: sourceInfo.type
    };
  }

  function getTrackList() {
    console.log('track list');
    const externalAPI = window.wrappedJSObject.externalAPI;
    const list = externalAPI.getTracksList();

    return [...list].map(track => ({
      artists: [...track.artists].map(artist => artist.title),
      title: track.title,
      link: track.link
    }));
  }

  browser.runtime.onMessage.addListener(commandHandler);
})();
