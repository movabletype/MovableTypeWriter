jQuery( function() {
  var setting;

  jQuery(document).ready( function() {
    setting = JSON.parse(localStorage.getItem('setting'));
    if ( !setting || !setting.apipath ) {
      location.href="options.html";
      return;
    }

    // Sign In
    var api = new MT.DataAPI({
      baseUrl:  setting.apipath,
      clientId: "movabletype-writer"
    });

    api.authenticate({
      username: setting.username,
      password: setting.password,
      remember: true
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

      // Loading site list.
      api.listBlogsForUser('me', function(response) {
        if (response.error) {
          var code = response.error.code;
          var msg;
          if (code === 404 ) {
            msg = 'User not found.'
          } else if (code === 403 ) {
            msg = 'You have no permissions.';
          } else {
            msg = response.error.message;
          }
          jQuery('#msg').append('<p class="alert bg-danger">An error occurs: ' + msg + '</p>')
          return;
        }
        var $blogListBox = jQuery('#form-blog-list');
        response.items.forEach( function(x, i) {
          $blogListBox.append($('<option>').html(x.name).val(x.id));
        });
        $blogListBox.removeAttr('disabled');
      });

      // Post handler
      jQuery('#button-post').click( function() {
        jQuery('#msg').children().remove();
        jQuery('#post-form-fieldset').attr('disabled', 'disabled');

        var entry = {};
        entry['title'] = jQuery('#entry-title').val();
        entry['body'] = jQuery('#entry-body').val();
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
                msg = 'Site not found.'
              } else if (code === 401 ) {
                msg = 'Should authenticate first.';
              } else if (code === 403 ) {
                msg = 'You do not have permission to create an entry.';
              } else {
                msg = response.error.message;
              }
              jQuery('#msg').append('<p class="alert bg-danger">An error occurs: ' + msg + '</p>')
              jQuery('#post-form-fieldset').removeAttr('disabled');
              return;
            }
            jQuery('#msg').append('<p class="alert bg-success">Your post has been published. <a href="' + response.permalink + '" target="_blank">View Entry</a></p>');
            jQuery('#post-form-fieldset').removeAttr('disabled');
          });
        });
      });
    });
  });
});
// Sticky header
$(window).scroll(function(){
    if ($(window).scrollTop() >= 50) {
       $('.global').addClass('fixed');
    }
    else {
       $('.global').removeClass('fixed');
    }
});
// textarea auto height
$(document).on('input.textarea', '#entry-body', function(){
    var minRows = this.getAttribute('data-min-rows')|0,
        rows    = this.value.split("\n").length;

    this.rows = rows < minRows ? minRows : rows;
});
