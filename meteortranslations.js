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
    },
    custom: function() {
      if (this.isSet && this.value !== this.field('password').value) {
        return 'invalidPasswordConfirmation';
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

  function parseError(error) {
    var errors = {
      'User not found': [
        {
          name: 'login',
          type: 'incorrect'
        }
      ],
      'Incorrect password': [
        {
          name: 'password',
          type: 'incorrect'
        }
      ],
      'Username already exists.': [
        {
          name: 'username',
          type: 'taken'
        }
      ],
      'Email already exists.': [
        {
          name: 'email',
          type: 'taken'
        }
      ]
    };

    return errors[error.reason];
  }

  AutoForm.addHooks(null, {
    onError: function (e, error) {
      var errors = parseError(error);
      
      if (errors) {
        var names = _.map(errors, function(error) {
          return error.name;
        });

        errors.forEach(function(error) {
          this.addStickyValidationError(error.name, error.type);
        }.bind(this));
        
        this.template.$('form').on('input', 'input', function(event) {
          var name = event.target.name;

          if (_.contains(names, name)) {
            this.removeStickyValidationError(name);
          }
        }.bind(this));
      }
    }
  });
}
