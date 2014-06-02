jQuery( function() {
  var setting;

  jQuery(document).ready( function() {
    setting = JSON.parse(localStorage.getItem('setting'));
    if ( !setting || !setting.apipath ) {
      location.href="options.html";
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
        // Handle error
        return;
      }
      api.storeTokenData(response);
      api.listBlogsForUser('me', function(response) {
        if (response.error) {
          // Handle error
          return;
        }
        var $blogListBox = jQuery('#form-blog-list');
        response.items.forEach( function(x, i) {
          $blogListBox.append($('<option>').html(x.name).val(x.id));
        });
        $blogListBox.removeAttr('disabled');

        jQuery('#button-post').click( function() {
          jQuery('#msg').children().remove();
          jQuery('#post-form').children().attr('disabled');

          var entry = {};
          entry['title'] = jQuery('#entry-title').val();
          entry['body'] = jQuery('#entry-body').val();
          entry['status'] = 'Publish';
          
          var siteId = jQuery('#form-blog-list option:selected').val();
          api.getToken(function(response) {
            if (response.error) {
              // Handle error
              return;
            }
            api.createEntry(siteId, entry, function(response) {
              if (response.error) {
                // Handle error
                return;
              }
              jQuery('#msg').append('span')
                .addClass('label label-success')
                .text('Post successfully.');
            });
          });
        });
      });
    });
  });
});
