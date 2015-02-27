app.constant('appInfo', {
  VERSION: '1.0.1'
});

app.constant('apiSettings', {
  KEY_NAME: 'apiSettings',
  API_VERSION: 'v2',
  CLIENT_ID: 'MovableTypeWriter',
  API_PATH: 'apipath',
  USERNAME: 'username',
  PASSWORD: 'password'
});

app.constant('uploadSettings', {
  KEY_NAME: 'uploadSettings',
  DEFAULT_UPLOAD_PATH: 'defaultUploadPath',
  THUMBNAIL_SIZE: 'thumbnailSize',
  SQUARE: 'square'
});

app.constant('cacheData', {
  KEY_NAME: 'cacheData',
  CACHE_SITE_LIST: 'siteList',
  CACHE_SAVED_ENTRY: 'savedEntry'
});

app.constant('Events', {
  RELOAD_SITE_LIST: 'reloadSitesist',
  SHOW_MESSAGE: 'showMessage',
  CHECK_CATEGORY: 'checkCategory',
  UNCHECK_CATEGORY: 'uncheckCategory',
  API_PATH_CHANGED: 'apiPathChanged'
});

app.constant('Notification', {
  ERROR: 0,
  SUCCESS: 1
});
