'use strict';

var request = require('axios');
var React = require('react');
var classSet = require('classnames');

var api = require('../api');

module.exports = React.createClass({
  getInitialState() {
    return {
      email: '',
      submitted: false,
      sending: false,
      error: null
    };
  },
  onSubmit(e) {
    e.preventDefault();

    this.setState({
      submitted: false,
      sending: true,
      error: null
    });

    request.post(api('invites'), {
      email: this.state.email.trim()
    })
    .then(this.handleSuccess)
    .catch(this.handleError);
  },
  handleSuccess() {
    this.setState({submitted: true, sending: false});
  },
  handleError(err) {
    this.setState({error: err, sending: false});
  },
  onChange(e) {
    if(e.target.value === this.state.email) {
      return;
    }
    this.setState({
      email: e.target.value,
      error: null,
      submitted: false
    });
  },
  render() {
    var formClasses = classSet({
      'invite-form': true,
      'has-success': this.state.submitted,
      'has-error': this.state.error,
      'sending': this.state.sending
    });

    var inputClasses = classSet({
      'input': true,
      'has-success': this.state.submitted,
      'has-error': this.state.error
    });

    var feedbackMessage;

    if(this.state.error || this.state.submitted) {
      let messageText;

      if(this.state.submitted) {
        messageText = 'Kutsu lähetetty antamaasi sähköpostiosoitteeseen.';
      } else if(this.state.error.status === 400 && this.state.error.data === 'invalid_email') {
        messageText = 'Tarkasta syöttämäsi sähköpostiosoite';
      } else if(this.state.error.status === 400 && this.state.error.data === 'already_invited') {
        messageText = 'Sähköpostiosoitteeseen on jo lähetetty kutsu';
      } else {
        messageText = 'Jotain meni pieleen. Yritä hetken päästä uudelleen.';
      }

      feedbackMessage = (
        <div className='invite-form--message'>
          {messageText}
        </div>
      );
    }

    return (
      <form className={formClasses} onSubmit={this.onSubmit}>
        <input
          className={inputClasses}
          type='text'
          name='email'
          placeholder='Email'
          value={this.state.email}
          onChange={this.onChange} />
        <button
          className='btn btn__submit'
          type='submit'
          title='Lähetä'
          disabled={this.state.error || this.state.submitted}>
          ⏎
        </button>
        <span
          className='loader'>
        </span>
        {feedbackMessage}
      </form>
      )
  }
});
