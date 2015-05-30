Meteor.startup(function () {
    // code to run on server at startup
  });
  Meteor.publish("todolists", function(){
    return Todolists.find({
      $or:[
      {private: {$ne:true}},
      {owner: this.userId}]
    });

  });
