var browseraction = {};
//lfodkcaadjjbaliojcippghjfibodnil
//3unj0g6hnpd4ncu1sgtg843cv40jtl65
browseraction.QUICK_ADD_API_URL_= 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events/quickAdd';
browseraction.CALENDAR_LIST_API_URL_ = 'https://www.googleapis.com/calendar/v3/users/me/calendarList';
browseraction.loadCalendarsIntoQuickAdd_ = function() {
    chrome.storage.local.get('calendars', function(storage) {
        if(storage['calendars']) {
            var calendars = storage['calendars'];
            var dropDown = $('#quick-add-calendar-list');
            for(var calendarId in calendars) {
                var calendar = calendars[calendarId];
                if(calendar.editable && calendar.visible){
                    dropDown.append($('<option>', {
                        value: calendar.id,
                        text: calendar.title
                        }));
                }
            }

        }

    });
};
browseraction.getCalList = function() {
    chrome.identity.getAuthToken({'interactive': true}, function (authToken) {
        console.log(authToken);
        $.ajax(browseraction.CALENDAR_LIST_API_URL_, {
        headers: {
          'Authorization': 'Bearer ' + authToken
        },
        success: function(data) {
          var calendars = {};
		  var dropDown = $('#quick-add-calendar-list');
          for (var i = 0; i < data.items.length; i++) {
            var calendar = data.items[i];
            console.log(calendar.id);
			dropDown.append($('<option>', {
            value: calendar.id,
            text: calendar.id
			}));
            }
			$('#quick-add-button').on('click', function() {
	console.log($('#quick-add-event-title').val().toString());
	console.log($('#quick-add-calendar-list').val());
    browseraction.createQuickAddEvent_($('#quick-add-event-title').val().toString(), $('#quick-add-calendar-list').val());
    $('#quick-add-event-title').val('');
});
        }
        });
    });
}

        
browseraction.createQuickAddEvent_ = function(text,calendarId) {
    var quickAddUrl = browseraction.QUICK_ADD_API_URL_.replace('{calendarId}', encodeURIComponent(calendarId)) + '?text=' + encodeURIComponent(text);
    chrome.identity.getAuthToken({'interactive': false}, function (authToken){
		console.log(authToken);
		console.log(quickAddUrl);
        $.ajax(quickAddUrl, {
        type: 'POST',
        headers: {
          'Authorization': 'Bearer ' + authToken
        },
        success: function(response) {
            console.log("Event added");
        },
        error: function(response) {
            alert("Error" + response);
            //if(response.status === 401) {
              //  chrome.identity.removeCachedAuthToken({'token': authToken }, function() {});
            //}
        }
        });
    });
}

browseraction.getCalList();
console.log('done');
$('#quick-add-button').on('click', function() {
	console.log($('#quick-add-event-title').val().toString());
	console.log($('#quick-add-calendar-list').val());
    browseraction.createQuickAddEvent_($('#quick-add-event-title').val().toString(), $('#quick-add-calendar-list').val());
    $('#quick-add-event-title').val('');
});









