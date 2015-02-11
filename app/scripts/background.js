chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    id: 'MovableTypeWriter',
    bounds: {
      width: 1000,
      height: 600,
      left: 100,
      top: 100
    },
    minWidth: 1000,
    minHeight: 600
  });
});
