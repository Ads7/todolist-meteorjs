Todolists = new Mongo.Collection('todolists');

if (Meteor.isClient) {
  Meteor.subscribe("todolists");

  Template.body.helpers({
    todolists: function(){
     if (Session.get('hideFinished')){
      return Todolists.find({checked: {$ne:true}});
     }
     else{
      return Todolists.find();
    }
    },
    hideFinished: function(){
      return Session.get('hideFinished'); 
    }

  });

  Template.body.events({
    'submit .new-item': function(event){
      var title = event.target.title.value;

     Meteor.call("addTodolist", title);
      event.target.title.value ="";

      return false
    },
    'change .hide-finished':function(event){
      Session.set('hideFinished', event.target.checked);
    

    }
  });
  Template.todolist.helpers({
    isOwner: function(){
    return this.owner === Meteor.userId();
    }
  });  
Template.todolist.events({
  'click .toggle-checked':function(){
    Meteor.call("updateTodolist",this._id, !this.checked);  
      },
'click .delete': function(){
  Meteor.call("deleteTodolist",this._id);
},
'click .toggle-private':function(){
    Meteor.call("setPrivate",this._id, !this.private);  
      }
});
Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
})
}

if (Meteor.isServer) {
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
}

Meteor.methods({
  addTodolist:function(title){
     Todolists.insert({
        title: title,
        createdAt: new Date(),
        owner:  Meteor.userId()
      });
  },
  updateTodolist: function(id, checked){
    var lst = Todolists.findOne(id);

    if(lst.owner !== Meteor.userId()){
      throw new Meteor.Error('not authorized to update');
    }
    Todolists.update(id, {$set:{checked: checked}});

  },
  deleteTodolist: function(id){
    var lst = Todolists.findOne(id);

    if(lst.owner !== Meteor.userId()){
      throw new Meteor.Error('not authorized to delete');
    }
    Todolists.remove(id);
  },
  setPrivate: function(id, private){
    var lst = Todolists.findOne(id);

    if(lst.owner !== Meteor.userId()){
      throw new Meteor.Error('not authorized to set private');
    }

    Todolists.update(id, {$set:{private: private}});
  }
});