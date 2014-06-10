jQuery( function() {
  var api;

  // function: Loading personal settings
  var getSettings = function() {
    var def = new jQuery.Deferred();
    var keys = [ 'apipath', 'username', 'password' ];

    chrome.storage.local.get(keys, function(item) {
      return def.resolve(item);
    });

    return def.promise();
  };

  // function: Sign into Movable Type via Data API
  var doSignIn = function(user, passwd) {
    var def = new jQuery.Deferred();

    api.authenticate({ username: user, password: passwd }, function(response) {
      if (response.error) {
        var code = response.error.code;
        var msg;
        if (code === 404 ) {
          msg = 'Cannot access to Data API CGI script. Please confirm URL for Data API Scrpt.';
        } else if (code === 401 ) {
          msg = 'Failed to sign in to Movable Type. Please confirm your Username or Password.';
        } else {
          msg = response.error.message;
        }
        return def.reject(msg);
      } else {
        api.storeTokenData(response);
        return def.resolve();
      }
    });

    return def.promise();
  };

  // Function: Loading site list
  var loadSiteList = function() {
    var def = new jQuery.Deferred();

    api.listBlogsForUser('me', function(response) {
      if (response.error) {
        var code = response.error.code;
        var msg;
        if (code === 404 ) {
          msg = 'User not found.';
        } else if (code === 403 ) {
          msg = 'You have no permissions.';
        } else {
          msg = response.error.message;
        }
        return def.reject(msg);
      }

      var $blogListBox = jQuery('#form-blog-list');
      $blogListBox.children().remove();
      $blogListBox.append($('<option>').html('Select blog...'));
      response.items.forEach( function(x, i) {
        $blogListBox.append($('<option>').html(x.name).val(x.id));
      });
      $blogListBox.removeAttr('disabled');
    });

    return def.promise();
  };

  jQuery(document).ready( function() {
    // Load summernote
    jQuery('#entry-body').summernote({
      height: 300,
      toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'italic', 'underline', 'clear']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['height', ['height']],
        ['table', ['table']],
        ['insert', ['link']],
        ['view', ['codeview']]
      ]
    });

    // Show setting dialog when user does not setup yet.
    getSettings().then(
      function(settings) {

        if (!settings || !settings.apipath) {
          return jQuery('#setting-panel-dialog').modal();
        }

        // Set value
        jQuery('#mt-api-path').val(settings.apipath);
        jQuery('#username').val(settings.username);
        jQuery('#password').val(settings.password);

        // Making API instance
        api = new MT.DataAPI({
          baseUrl:  settings.apipath,
          clientId: 'movabletype-writer'
        });

        // Sign in
        doSignIn(settings.username, settings.password)
        .then( loadSiteList );

      }
    );
  });

  jQuery('#save-settings').click( function() {
    jQuery('#msg-modal').children().remove();
    jQuery('#setting-form-set').attr('disabled', 'disabled');

    var settings = {
      apipath: jQuery('#mt-api-path').val(),
      username: jQuery('#username').val(),
      password: jQuery('#password').val()
    };

    // Making API instance
    api = new MT.DataAPI({
      baseUrl:  settings.apipath,
      clientId: 'movabletype-writer'
    });

    // Sign In
    doSignIn(settings.username, settings.password).then(
      function () {
        // Save settings
        chrome.storage.local.set(settings, function() {
          jQuery('#msg-modal').append('<p class="alert bg-success">Your settings has been saved.');
        });
        loadSiteList();
      },
      function (msg) {
          jQuery('#msg-modal').append('<p class="alert bg-danger">An error occurs: ' + msg + '</p>');
      }
    );
    jQuery('#setting-form-set').removeAttr('disabled');
  });

  jQuery('#button-post').click( function() {
    jQuery('#msg').children().remove();
    jQuery('#post-form-fieldset').attr('disabled', 'disabled');

    var entry = {};
    entry['title'] = jQuery('#entry-title').val();
    entry['body'] = jQuery('#entry-body').code();
    entry['status'] = 'Publish';

    var siteId = jQuery('#form-blog-list option:selected').val();
    api.getToken(function(response) {
      if (response.error) {
        // Try again to sign in.
        return;
      }
      api.createEntry(siteId, entry, function(response) {
        if (response.error) {
          var code = response.error.code;
          var msg;
          if (code === 404 ) {
            msg = 'Site not found.';
          } else if (code === 401 ) {
            msg = 'Should authenticate first.';
          } else if (code === 403 ) {
            msg = 'You do not have permission to create an entry.';
          } else {
            msg = response.error.message;
          }
          jQuery('#msg').append('<p class="alert bg-danger">An error occurs: ' + msg + '</p>');
          jQuery('#post-form-fieldset').removeAttr('disabled');
          return;
        }
        jQuery('#msg').append('<p class="alert bg-success">Your post has been published. <a href="' + response.permalink + '" target="_blank">View Entry</a></p>');
        jQuery('#post-form-fieldset').removeAttr('disabled');
      });
    });
  });

  jQuery('#button-setting').click( function() {
    jQuery('#setting-panel-dialog').modal();
  });
});

// Sticky header
/*
$(window).scroll(function(){
  if ($(window).scrollTop() >= 50) {
    $('.global').addClass('fixed');
  }
  else {
    $('.global').removeClass('fixed');
  }
});
*/

// textarea auto height
/*
$(document).on('input.textarea', '#entry-body1', function(){
  var minRows = this.getAttribute('data-min-rows')|0,
  rows        = this.value.split("\n").length;

  this.rows = rows < minRows ? minRows : rows;
});
*/
