/** The events that join template contains */
Template.join.events({
    /** A form submission updates the user's name and opens the meeting page */
    'submit form': function(e) {
        e.preventDefault();
        var meetingId = Session.get("meetingId");
        var meeting = Meetings.findOne({_id: meetingId});

        if (meeting.password != e.target.pass.value) {
            Session.set("joinError", 'The password you entered is incorrect.');
            Router.go('/join/'+ meetingId +'/' + Session.get("userId"));
        } else {
            Users.insert({
                _id: e.target.participantName.value, 
                name: e.target.participantName.value,
                status: "online",
                meeting: meetingId
            });
            
            Session.set("userId", e.target.participantName.value);
            Router.go('/meeting/' + meetingId);
        }
    }
});

Template.join.helpers({
    joinError: function() { return Session.get('joinError'); }
});

