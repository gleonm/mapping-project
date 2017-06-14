/* global THREE */
(function (global) {
  'use strict';

  var world;

  // Arreglo de nombres de los archivos OBJ
  var objFiles = [
    'models/Head_04.obj',
    'models/Head_05.obj',
    'models/Head_06.obj'
  ];

  // Arreglo que guarda lo que fueron cargando los archivos OBJ
  var models = [];

  function loadModels() {
    var loader = new THREE.OBJLoader();
    for (var i = 0; i < objFiles.length; i++) {
      loader.load(objFiles[i], function (group) {
        models.push(group);
      });
    }
  }

  /********************
   * MappingApp logic *
   ********************/

  var MappingApp = function (_world) {
    world = _world;
  };

  MappingApp.prototype.setup = function () {
    loadModels();

    $('canvas').on('click', function () {
      var model = models[Math.floor(Math.random() * 3)];

      var char = new Character(model);
      char.setMaterial(new THREE.MeshNormalMaterial());
      char.object.position.x = (Math.random() * 100) - 50;
      world.scene.add(char.object);
    });
  };

  MappingApp.prototype.update = function () {};

  global.MappingApp = MappingApp;
})(window);
