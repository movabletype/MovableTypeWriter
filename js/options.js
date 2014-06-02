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
      clientId: "postmt4chrome"
    });

    api.authenticate({
      username: setting.username,
      password: setting.password,
    }, function(response) {
      if (response.error) {
        // Handle error
        return;
      }
      api.storeTokenData(response);

      // Save settings
      localStorage.setItem('setting', JSON.stringify(setting));
      jQuery('#msg').append('<p class="alert bg-success">Your settings has been saved. <a href="main.html">Post a new entry</a></p>')
    });
  });
});
