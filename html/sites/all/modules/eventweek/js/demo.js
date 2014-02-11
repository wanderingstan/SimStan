$(document).ready(function() {

  var $calendar = $('#calendar');
  var id = 10;
  
  $calendar.weekCalendar({
    dateFormat: eventweekOptions.dateFormat,
    timeFormat: eventweekOptions.timeFormat,
    timeslotsPerHour : 4,
    timeslotHeight: 20,
    allowCalEventOverlap : true,
    readonly : eventweekOptions.readonly, 
    buttonText : eventweekOptions.buttonText,
    businessHours :{start: 8, end: 18, limitDisplay: false },
    height : function($calendar) {
      return $(window).height() - $("h1").outerHeight();
    },
    calendarBeforeLoad : function(calendar) {
      if (!calendar.find('#calendar-simstan-nav').length) {
        calendar.find('#calendar-nav-left').append('<span id="calendar-simstan-nav"><a href="/">SimStan Main Site</a></span>');
      }
      calendar.find('#calendar-nav-right').html('&nbsp;&nbsp;Loading Calendar, please wait... <img src="/sites/all/modules/eventweek/ajax-loader.gif" align="top"/>');
    },
    calendarAfterLoad : function(calendar) {
      calendar.find('#calendar-nav-right').html('&nbsp;&nbsp;Click and drag downward to create an event. Click on events to edit them.');      
    },
    
    /**
     * RENDER the event
     */
    eventRender : function(calEvent, $event) {
      var locked = false;
      for (var term in calEvent.taxonomy) {
        if (calEvent.taxonomy[term].name == "Locked") {
          locked = true;
        }
      }
      
      if (calEvent.end.getTime() < new Date().getTime()) {
        $event.css({
          "backgroundColor" : "#aaa",
          "border" : "1px solid #888"          
        });
        //$event.css("background","url(" + calEvent.picture + ")");
        $event.find(".time").css({
          "backgroundColor" : "#999",
          "border" : "1px solid #888"
        });
      }
      else 
      if (locked) {
        $event.css({
          "backgroundColor" : "#BB3300",
          "border" : "1px solid #BB3300"          
        });
        //$event.css("background","url(" + calEvent.picture + ")");
        $event.find(".time").css({
          "backgroundColor" : "#BB3300",
          "border" : "1px solid #BB3300"
        });        
      }
      
     // $event[0].innerHTML = '<div>YOYOYOYOYOYO</div>' + innerHTML;
    },
    draggable : function(calEvent, $event) {
      if (calEvent.end.getTime() < new Date().getTime()) return false;
      return calEvent.readOnly != true;
    },
    resizable : function(calEvent, $event) {
      if (calEvent.end.getTime() < new Date().getTime()) return false;
      return calEvent.readOnly != true;
    },
    /**
     * NEW event
     */
    eventNew : function(calEvent, $event) {

      var $dialogContent = $("#event_edit_container");
      resetForm($dialogContent);
      var startField = $dialogContent.find("select[name='start']").val(calEvent.start);
      var endField =  $dialogContent.find("select[name='end']").val(calEvent.end);
      var titleField = $dialogContent.find("input[name='title']");
      var bodyField = $dialogContent.find("textarea[name='body']");
      
      if (eventweekOptions.userId > 1) {
        // don't allow new events created in past
        if (calEvent.end.getTime() < new Date().getTime()) {
          $calendar.weekCalendar("removeUnsavedEvents");        
          return;
        };
        // don't allow new events created on current day (lockout)
        if (calEvent.end.getTime() < (eventweekOptions.calendarLockedUntilUnixTime * 1000)) {
          $calendar.weekCalendar("removeUnsavedEvents");
          alert("The current day has been locked.\nPlease add new events after " + new Date(eventweekOptions.calendarLockedUntilUnixTime * 1000));
          return;
        };
      }
      
      $dialogContent.dialog({
        modal: true,
        width: 400,        
        title: "New Calendar Event",
        close: function() {
           $dialogContent.dialog("destroy");
           $dialogContent.hide();
           $('#calendar').weekCalendar("removeUnsavedEvents");
        },
        buttons: {
          save : function(){

            // validation checks
            if (!titleField.val()) {
              alert("An event must have a title.");
              return;
            }

            calEvent.start = new Date(startField.val());
            calEvent.end = new Date(endField.val());
            calEvent.title = titleField.val();
            calEvent.body = "Saving...";
            calEvent.body_raw = bodyField.val();

            // Save Event to Drupal
            $.post('/eventweek/json_api/create_event', calEvent, 
              function(data) {
                //alert(data + " is from the server");
                //alert(data.type);
                //alert(data.body);
                //alert(data.title);
                
                calEvent.id = data.nid;
                calEvent.start = new Date(startField.val());
                calEvent.end = new Date(endField.val());
                calEvent.title = data.title;
                calEvent.body = data.body;
                calEvent.name = data.name;
                calEvent.picture = data.picture;
                calEvent.uid = data.uid;
                calEvent.body_raw = data.body_raw;

                $calendar.weekCalendar("removeUnsavedEvents");
                $calendar.weekCalendar("updateEvent", calEvent);
                $dialogContent.dialog("close");                
              },
              "json"
            );

          },
          Cancel : function(){
            $calendar.weekCalendar("updateEvent", calEvent);
            $calendar.weekCalendar("removeUnsavedEvents");
            $dialogContent.dialog("close");
          }
        }
      }).show();
      
       
      titleField.focus();
       
      $dialogContent.find(".date_holder").text(calEvent.start.getFullYear() + "-" + calEvent.start.getMonth() + "-" + calEvent.start.getDate());
      setupStartAndEndTimeFields(startField, endField, calEvent, $calendar.weekCalendar("getTimeslotTimes", calEvent.start));
      $(window).resize(); //fixes a bug in modal overlay size ??
      
      
    },
    /**
     * MOVE event
     */
    eventDrop : function(calEvent, $event) {
      // Save Event to Drupal
      $.post('/eventweek/json_api/update_event/'+calEvent.id, calEvent, 
        function(data) {
          calEvent.title = data.title;
          calEvent.body = data.body;
          //alert("Event updated after move.");
        },
        "json"
      );  
    },
    /**
     * RESIZE event
     */    
    eventResize : function(calEvent, $event) {
      
      // Save Event to Drupal
      $.post('/eventweek/json_api/update_event/'+calEvent.id, calEvent, 
        function(data) {
          calEvent.title = data.title;
          calEvent.body = data.body;
          //alert("Event updated after resize");
        },
        "json"
      );        
      //alert("Resize!");
    },
    /**
     * VIEW / EDIT event
     */
    eventClick : function(calEvent, $event) {
      
      
      var locked = false;
      for (var term in calEvent.taxonomy) {
        if (calEvent.taxonomy[term].name == "Locked") {
          locked = true;
        }
      }

      if (eventweekOptions.userId == 1) {
        locked = false;
      }

      if ((calEvent.end.getTime() < new Date().getTime()) || (locked)) {
        // event is in past
        var $dialogContent = $("#event_view_container");
        resetForm($dialogContent);
        var startField = $dialogContent.find("#view-start-field");
        var endField =  $dialogContent.find("#view-end-field");
        var titleField = $dialogContent.find("#view-title-field'");
        var bodyField = $dialogContent.find("#view-body-field");
        $dialogContent.find("#view-start-field").html(String(calEvent.start).slice(15,24));
        $dialogContent.find("#view-end-field").html(String(calEvent.end).slice(15,24));
                
        $dialogContent.find("#view-title-field").text(calEvent.title);
        $dialogContent.find("#view-body-field").html(calEvent.body);
        $dialogContent.find(".view-creator-holder").html('<a href="/user/' + calEvent.uid + '" title="' + calEvent.name + '"><img class="cal-user-picture" src="/' + calEvent.picture + '">' + calEvent.name + '</a>');
        $dialogContent.dialog({
          modal: true,
          width: 600,        
         
          title: calEvent.title + (locked ? ' [Locked]' : ''),
          close: function() {
             $dialogContent.dialog("destroy");
             $dialogContent.hide();
             $('#calendar').weekCalendar("removeUnsavedEvents");
          },
          buttons: {
            "Cancel" : function(){
              $dialogContent.dialog("close");
            }
          }
        }).show();

        var details = '';
        if (locked) {
          details += '<div><i>This event is locked and may not be changed</i></div>';
        }
        $dialogContent.find(".details_holder").html(details + "<a target='_top' href='/node/"+ calEvent.id  +"'>View details...</a>");
        $(window).resize(); //fixes a bug in modal overlay size ??
        
      }
      else {
        //
        // event is in future      
        //
        var $dialogContent = $("#event_edit_container");
        resetForm($dialogContent);
        var startField = $dialogContent.find("select[name='start']").val(calEvent.start);
        var endField =  $dialogContent.find("select[name='end']").val(calEvent.end);
        var titleField = $dialogContent.find("input[name='title']").val(calEvent.title);
        var bodyField = $dialogContent.find("textarea[name='body']");
        bodyField.val(calEvent.body_raw);
        $dialogContent.find(".edit-creator-holder").html('<a href="/user/' + calEvent.uid + '" title="' + calEvent.name + '"><img class="cal-user-picture" src="/' + calEvent.picture + '">' + calEvent.name + '</a>');

        $dialogContent.dialog({
          modal: true,
          width: 400,        
          
          title: "Edit - " + calEvent.title,
          close: function() {
             $dialogContent.dialog("destroy");
             $dialogContent.hide();
             $('#calendar').weekCalendar("removeUnsavedEvents");
          },
          buttons: {
            Save : function(){
  
              // validation checks
              if (!titleField.val()) {
                alert("An event must have a title.");
                return;
              }
  
              calEvent.start = new Date(startField.val());
              calEvent.end = new Date(endField.val());
              calEvent.title = titleField.val();
              calEvent.body_raw = bodyField.val();
              calEvent.body = "Saving...";
                         
              // Save Event to Drupal
              $.post('/eventweek/json_api/update_event/'+calEvent.id, calEvent, 
                function(data) {
                  //alert(data + " is from the server");
                  //alert(data.type);
                  //alert(data.body);
                  //alert(data.title);
                  
                  calEvent.start = new Date(startField.val());
                  calEvent.end = new Date(endField.val());
                  
                  // TODO: is there some smarter way of getting all our custom attributes imported?
                  calEvent.title = data.title;
                  calEvent.body = data.body;
                  calEvent.name = data.name;
                  calEvent.picture = data.picture;
                  calEvent.uid = data.uid;
                  calEvent.body_raw = data.body_raw;

                  $calendar.weekCalendar("removeUnsavedEvents");
                  $calendar.weekCalendar("updateEvent", calEvent);
                  $dialogContent.dialog("close");
                  
                  //alert("Event updated.");
                },
                "json"
              );
              
              //alert("Modify event!");
            },
            "Delete" : function() {
            if (confirm("Are you sure you want to delete this event?")) {
              // Delete Event in Drupal
              $.post('/eventweek/json_api/delete_event/'+calEvent.id, calEvent, 
                function(data) {
                  $calendar.weekCalendar("removeEvent", calEvent.id);
                  $dialogContent.dialog("close");                
                }
              );
            }
        },
            Cancel : function(){
              $dialogContent.dialog("close");
            }
          }
        }).show();
        
        var startField = $dialogContent.find("select[name='start']").val(calEvent.start);
        var endField =  $dialogContent.find("select[name='end']").val(calEvent.end);
        $dialogContent.find(".date_holder").text(calEvent.start.getFullYear() + "-" + calEvent.start.getMonth() + "-" + calEvent.start.getDate());
        $dialogContent.find(".details_holder").html("<a target='_top' href='/node/"+ calEvent.id  +"/edit'>Edit details...</a>");
        
        titleField.focus();
                
        setupStartAndEndTimeFields(startField, endField, calEvent, $calendar.weekCalendar("getTimeslotTimes", calEvent.start));
        $(window).resize(); //fixes a bug in modal overlay size ??
      }
    },
    eventMouseover : function(calEvent, $event) {
    },
    eventMouseout : function(calEvent, $event) {
    },
    noEvents : function() {
      
    },
    
    data : "/eventweek/json_api/fetch_events",
  });
  
  function resetForm($dialogContent) {
     $dialogContent.find("input").val("");
     $dialogContent.find("textarea").val("");
  }
  
  /*
   * Sets up the start and end time fields in the calendar event 
   * form for editing based on the calendar event being edited
   */
  function setupStartAndEndTimeFields($startTimeField, $endTimeField, calEvent, timeslotTimes) {
      
     for(var i=0; i<timeslotTimes.length; i++) {
      var startTime = timeslotTimes[i].start; 
      var endTime = timeslotTimes[i].end;
      var startSelected = "";
      if(startTime.getTime() === calEvent.start.getTime()) {
        startSelected = "selected=\"selected\"";
      }
      var endSelected = "";
      if(endTime.getTime() === calEvent.end.getTime()) {
        endSelected = "selected=\"selected\"";
      }
      $startTimeField.append("<option value=\"" + startTime + "\" " + startSelected + ">" + timeslotTimes[i].startFormatted + "</option>");
      $endTimeField.append("<option value=\"" + endTime + "\" " + endSelected + ">" + timeslotTimes[i].endFormatted + "</option>");
     
    }
    $endTimeOptions = $endTimeField.find("option"); 
    $startTimeField.trigger("change");
  }
   
   var $endTimeField = $("select[name='end']"); 
   var $endTimeOptions = $endTimeField.find("option"); 
  
   //reduces the end time options to be only after the start time options.
   $("select[name='start']").change(function(){
    var startTime = $(this).find(":selected").val();
    var currentEndTime = $endTimeField.find("option:selected").val();
    $endTimeField.html(
      $endTimeOptions.filter(function(){
        return startTime < $(this).val();
      })
    );
    
    var endTimeSelected = false;
    $endTimeField.find("option").each(function() {
      if($(this).val() === currentEndTime) {
        $(this).attr("selected", "selected");
        endTimeSelected = true;
        return false;
      }
    });
    
    if(!endTimeSelected) {
       //automatically select an end date 2 slots away. 
       $endTimeField.find("option:eq(1)").attr("selected", "selected");
    }
    
  }); 
  
  
  var $about = $("#about");
  
  $("#about_button").click(function(){
    $about.dialog({
        title: "About SimStan",
        width: 600,
        close: function() {
           $about.dialog("destroy");
           $about.hide();
        },
        buttons: {
          close : function(){
            $about.dialog("close");
          }
        }
      }).show();
  });
  

});