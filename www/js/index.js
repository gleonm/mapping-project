(function () {
  'use strict';

  /*******************
   * WebSocket logic *
   *******************/

  // WebSocket
  var wsURL = 'ws://localhost:1881';
  var connection;

  function connectWithServer () {
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    connection = new WebSocket (wsURL);

    connection.onopen  = onConnectionOpen;
    connection.onerror = onConnectionError;
  }

  function onConnectionOpen () {
    console.log('Connected with server!');

    $('#status').html('Connected with server');

    var message = {
      type : 'register',
      data : 'input'
    };
    connection.send(JSON.stringify(message));
  }

  function onConnectionError () {
    console.log('Error in connection :(!');
    $('#status').html('Not connected :(');
  }

  function onSendText () {
    var text = $('#input').val();
    
    if (connection && connection.readyState === connection.OPEN) {
      var message = {
        type : 'text',
        data : text
      };
      connection.send(JSON.stringify(message));
    }

    $('#input').val('');
  }

  $(document).ready(function () {
    connectWithServer();

    $('#input02').on('click', onSendText);
  });
})();