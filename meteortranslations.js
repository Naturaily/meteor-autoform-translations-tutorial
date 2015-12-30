LoginSchema = new SimpleSchema({
  login: {
    type: String
  },
  password: {
    type: String,
    autoform: {
      afFieldInput: {
        type: 'password'
      }
    }
  }
});

RegistrationSchema = new SimpleSchema({
  username: {
    type: String
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  password: {
    type: String,
    autoform: {
      afFieldInput: {
        type: 'password'
      }
    }
  },
  passwordConfirmation: {
    type: String,
    autoform: {
      afFieldInput: {
        type: 'password'
      }
    }
  }
});

if (Meteor.isClient) {
  AutoForm.hooks({
    signUpForm: {
      onSubmit: function(data) {
        this.event.preventDefault();
        Accounts.createUser(data, this.done);
      }
    },
    signInForm: {
      onSubmit: function(data) {
        this.event.preventDefault();
        Meteor.loginWithPassword(data.login, data.password, this.done);
      }
    }
  });

  Template.forLoggedIn.events({
    'click #logout': function (e) {
      e.preventDefault();
      Meteor.logout();
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
