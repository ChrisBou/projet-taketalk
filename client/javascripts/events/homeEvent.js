/** The events that home template contains */
openMeeting = function(el){
    var val = el.value;
    Router.go('/join/'+val);
};

Template.home.events({
    //Redirection vers la page de création de meeting
    'click #new': function(e){
        Router.go('create');
    }
});