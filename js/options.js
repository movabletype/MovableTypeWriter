jQuery( function() {
  jQuery(document).ready( function() {
    var setting = JSON.parse(localStorage.getItem('setting'));
    if ( setting ) {
      jQuery('#mt-api-path').val(setting.apipath);
      jQuery('#username').val(setting.username);
      jQuery('#password').val(setting.password);
    }
  });

  jQuery('button.btn-primary').click( function() {
    jQuery('#msg').children().remove();

    var setting = {
      apipath: jQuery('#mt-api-path').val(),
      username: jQuery('#username').val(),
      password: jQuery('#password').val()
    };

    // Sign In
    var api = new MT.DataAPI({
      baseUrl:  setting.apipath,
      clientId: "movabletype-writer"
    });

    api.authenticate({
      username: setting.username,
      password: setting.password,
    }, function(response) {
      if (response.error) {
        var code = response.error.code;
        var msg;
        if (code === 404 ) {
          msg = 'Cannot access to Data API CGI script. Please confirm URL for Data API Scrpt.'
        } else if (code === 401 ) {
          msg = 'Failed to sign in to Movable Type. Please confirm your Username or Password.';
        } else {
          msg = response.error.message;
        }
        jQuery('#msg').append('<p class="alert bg-danger">An error occurs: ' + msg + '</p>')
        return;
      }
      api.storeTokenData(response);

      // Save settings
      localStorage.setItem('setting', JSON.stringify(setting));
      jQuery('#msg').append('<p class="alert bg-success">Your settings has been saved. <a href="main.html">Post a new entry</a></p>')
    });
  });
});
