Template.end.helpers ({
	//Retourne le ien du rapport du meeting
    reportLink: function () {
        var meeting = Meetings.findOne({_id: Session.get("meetingId")});
        return meeting.reportLink;
    },

    //Retourne vrai si un lien de rapport a été renseigné a la création
    isReportLink: function() {
        return Meetings.findOne({_id: Session.get("meetingId")}).reportLink != "";
    }
});

Template.end.events({
	/** A click on exit closes the meeting */
    'click #exit': function() {
        Meetings.update(Session.get("meetingId"), {$set: {status: "done"}});
        Session.set("meetingId", "");
        Session.set("userId", "");
        Router.go("home");
    }
});