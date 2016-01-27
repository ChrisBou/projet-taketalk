Meteor.publish("allSpeechHeaders", function(){
    return Speeches.find();
});