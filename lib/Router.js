/** The configuration for the main layout */
Router.configure({
  layoutTemplate: 'layout'
});

/*Router.route('/', function () {
  this.render('home');
});*/

/** The route to the home page */
Router.route('/home', function () {
    this.render('home');
});

/** The route to the tutorial page */
Router.route('/tutorial', function () {
    this.render('tutorial');
});

/** The route to the downloads page */
Router.route('/downloads', function () {
  this.render('downloads');
});

/** The route to the create page */
Router.route('/create', function () {
  this.render('create');
});

/** The route to the meeting page */
Router.route('/meeting/:_meetingId', {
  name: 'meeting',
  data: function() {
      // Ajout d'un meeting pour les tests accessible via /meeting/test
      // !!! A commenter en prod !!!
      var speeches = Speeches.find({meeting: this.params._meetingId});

      var id = 'test';
      if (this.params._meetingId == id && Meetings.findOne({_id: id, status: "ongoing"}) === undefined) {
          Meteor.call('resetAll');

          Meetings.insert({
              name: 'La Nuit de l\'Info',
              status: "ongoing",
              ordres: ['Motiver les élèves', 'Former les participants', 'Préparer le repas du soir'],
              ordreTimes: [90, 130, 268],
              password: '0000',
              reportLink: 'https://docs.google.com/document/d/15Pcc6L1ofe4bY2uxg0yxvaAZO_XZQPe8JlsnvnDUEaQ/edit?usp=sharing',
              _id: id
          });
          Users.insert({ name:'Laurent Poligny',
              email: 'laurent.poligny@test.com',
              type: "animator",
              status: "online",
              meeting: id,
              _id: 'lpoligny'
          });

          Session.set("meetingId", id);
          Session.set("ordres", ['Motiver les élèves', 'Former les participants', 'Préparer le repas du soir']);
          Session.set("ordreTimes", [90, 130, 268]);
          Session.set("userId", 'lpoligny');
      } // FIN ajout meeting test
      else{
          Session.set("meetingId", this.params._meetingId);
      }

    // Recherche du meeting dont l'id est passé en paramètre
    // Redirection vers une page d'erreur "404 not found" lorsqu'aucun meeting n'est trouvé
    var meeting = Meetings.findOne({_id: this.params._meetingId, status: "ongoing"});
    if(meeting === undefined){
        console.log('undefined meeting...');
        Router.configure({layoutTemplate: 'layout', notFoundTemplate: '404'});
    }

    //Alimentation du tableau users avec les utilisateur présent au meeting
    var users = [];
    Users.find({meeting: this.params._meetingId}).forEach(function(user) {
        var paroles = [];
        if(user.paroles !== undefined) {
            paroles = user.paroles;
        }
        users.push({name: user.name, paroles: paroles});
    });

    // Alimentation de la variable user avec l'utilisateur actuel
    var user = Users.findOne({_id: Session.get("userId")});
    var isAnimator = false;
    if(user !== undefined){
        if(user.type == "animator") isAnimator = true;
    }

    var talk = "Talk";

    Speeches.find({user: Session.get("userId")}).observe({
      removed: function(speech) {
          if (!isAnimator) {
              $("#speech-delete-modal").modal("show");
          }
      }
    });

    return {
      meeting:    meeting.name,
      users:      users,
      speeches:   speeches,
      isAnimator: isAnimator,
      talk:       talk,
    };
  },
  waitOn: function(){
    return Meteor.subscribe("allSpeechHeaders");
  }
});

/** The route to the join page */
Router.route('/join/:_meetingId', {
    name: 'join',
    data: function() {

        // Recherche du meeting dont l'id est passé en paramètre
        // Redirection vers une page d'erreur "404 not found" lorsqu'aucun meeting n'est trouvé
        var meeting = Meetings.findOne({_id: this.params._meetingId});
        if(meeting === undefined){
            console.log('meeting undefined');
            Router.configure({layoutTemplate: 'layout', notFoundTemplate: '404'});
        }

        Session.set("meetingId", this.params._meetingId);
        //Session.set("userId", this.params._userId);

        return {};
    }
});

/** The route to the lineup page */
Router.route('/meeting/:_meetingId/lineup', function () {
    this.render('lineup');
});


/** The route to the end page */
Router.route('/end/:_meetingId', {
  name: 'end',
  data: function () {
    var users = [];

    Users.find({meeting: this.params._meetingId}).forEach(function(el) {
        users.push({name: el['name'], paroles: el['paroles']});
    });

	  Session.set("meetingId", this.params._meetingId);

    return{
      users: users
    };
  }
});
