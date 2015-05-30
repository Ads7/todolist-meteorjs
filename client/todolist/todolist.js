
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

