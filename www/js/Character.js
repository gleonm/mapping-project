(function (global) {

  var Character = function (model) {
    this.object = new THREE.Object3D();

    for (var i = 0; i < model.children.length; i++) {
      var child = model.children[i];

      if (child instanceof THREE.Mesh) {
        var geometry = child.geometry;
        var material = child.material;

        var mesh = new THREE.Mesh(geometry, material);
        this.object.add(mesh);
      }
    };
  };

  Character.prototype.setMaterial = function (material) {
    var children = this.object.children;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      child.material = material;
    }
  };

  global.Character = Character;
})(window);
