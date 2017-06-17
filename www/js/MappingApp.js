/* global THREE */
(function (global) {
  'use strict';

  // Constantes
  var PI = Math.PI;
  var TWO_PI = Math.PI * 2.0;
  var HALF_PI = Math.PI * 0.5;

  function random (start, end) {
    return (Math.random() * (end - start)) + start;
  }

  var world;

  /************
   * 3D logic *
   ************/

  // Arreglo de nombres de los archivos OBJ
  var objFiles = [
    'models/Head_04.obj',
    'models/Head_07.obj',
    'models/Head_08.obj',
    'models/Head_09.obj',
    'models/Head_14.obj'
  ];

  // Arreglo que guarda lo que fueron cargando los archivos OBJ
  var models = [];

  var font;

  // Object que va a guardar la relacion entre id -> character
  var characters = {};

  function loadAssets() {

    // Load models
    var loader = new THREE.OBJLoader();
    for (var i = 0; i < objFiles.length; i++) {
      loader.load(objFiles[i], function (group) {
        models.push(group);
      });
    }

    // Load font
    var loader = new THREE.FontLoader();
    loader.load('fonts/helvetiker_regular.typeface.json', function (response) {
      font = response;
    });
  }

  /*******************
   * WebSocket logic *
   *******************/

  // WebSocket
  var wsURL = 'ws://localhost:1881';
  var connection;

  function connectWithServer () {
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    connection = new WebSocket (wsURL);

    connection.onopen    = onConnectionOpen;
    connection.onerror   = onConnectionError;
    connection.onmessage = onConnectionMessage;
  }

  function onConnectionOpen () {
    console.log('Connected with server!');

    var message = {
      type : 'register',
      data : 'output'
    };
    connection.send(JSON.stringify(message));
  }

  function onConnectionError () {
    console.log('Error in connection :(!');
  }

  function onConnectionMessage (event) {
    var payload = event.data;
    var message = JSON.parse(payload);
    console.log(message);

    var type = message.type;
    var data = message.data;

    if (type === 'newInput') {
      createNewCharachter(data);
    }
    else if (type === 'text') {
      onTextReceived(data.from, data.text);
    }
    else if (type === 'disconnected') {
      onClientDisconnected(data);
    }
  }

  function createNewCharachter (idConnection) {

    // Se elige un modelo aleatorio y se crea un caracter con el
    var model = models[Math.floor(Math.random() * models.length)];

    var character = new Character(model, font);
    character.setMeshMaterial(new THREE.MeshNormalMaterial());
    character.setTextMaterial(new THREE.MeshNormalMaterial());

    // Se posiciona
    //var angle = random(PI * 0.25, PI * 0.75);
    //character.object.position.x = Math.cos(angle) * 30;
    //character.object.position.z = -Math.sin(angle) * 30;

    // Se agrega al mundo
    world.scene.add(character.object);

    // Se guarda la relacion idConnection <-> caracter
    characters[idConnection] = character;
  }

  function onClientDisconnected (idConnection) {
    var character = characters[idConnection];
    if (character) {
      world.scene.remove(character.object);
      delete characters[idConnection];
    }
  }

  function onTextReceived (from, text) {
    var character = characters[from];
    if (character) {
      character.talk(text);
    }
  }

  /********************
   * MappingApp logic *
   ********************/

  var MappingApp = function (_world) {
    world = _world;
  };

  MappingApp.prototype.setup = function () {
    loadAssets();
    connectWithServer();
  };

  MappingApp.prototype.update = function () {};

  global.MappingApp = MappingApp;
})(window);
