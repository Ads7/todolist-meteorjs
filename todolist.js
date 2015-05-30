Todolists = new Mongo.Collection('todolists');

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