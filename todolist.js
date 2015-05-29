Todolists = new Mongo.Collection('todolists');

if (Meteor.isClient) {
  // counter starts at 0
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
Template.todolist.events({
  'click .toggle-checked':function(){
    Meteor.call("updateTodolist",this._id, !this.checked);  
      },
'click .delete': function(){
  Meteor.call("deleteTodolist",this._id);
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
}

Meteor.methods({
  addTodolist:function(title){
     Todolists.insert({
        title: title,
        createdAt: new Date()
        
      });
  },
  updateTodolist: function(id, checked){
    Todolists.update(id, {$set:{checked: checked}});

  },
  deleteTodolist: function(id){
    Todolists.remove(id);
  }
});