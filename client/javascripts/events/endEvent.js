Template.end.helpers ({
	//Retourne le ien du rapport du meeting
    reportLink: function () {
        var meeting = Meetings.findOne({_id: Session.get("meetingId")});
        return meeting.reportLink;
    },

    //retourne le temps de parole total 
    totalTalk: function (name) {
        var i = 0;
        var user1;
        var paroles = [];

        use = Users.find({meeting: Session.get("meetingId")});
        use.forEach(function(el){
            if(el['name'] == name)
                user1 = el;
        });

        paroles = user1.paroles;

        paroles.forEach(function(el){
            i += el['timeTalk'];
        });

        return i;
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

Template.parole.helpers ({
    //affiche le temps en min:sec
    displayTime: function(nb){
        var minutes = Math.floor(nb / 60);
        var seconds = nb % 60;

        if(seconds < 10) {
            seconds = "0" + seconds;
        }

        return minutes+":"+seconds;
    }
});