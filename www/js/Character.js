(function (global) {

  var Character = function (model, font) {
    this.object = new THREE.Object3D();
    this.font = font;

    for (var i = 0; i < model.children.length; i++) {
      var child = model.children[i];

      if (child instanceof THREE.Mesh) {
        var geometry = child.geometry;
        var material = child.material;

        var mesh = new THREE.Mesh(geometry, material);
        this.object.add(mesh);
      }
    };

    var textGeometry = new THREE.TextGeometry('', {
      font   : this.font,
      size   : 2,
      height : 2.5
    });

    this.textMesh = new THREE.Mesh(textGeometry, new THREE.MeshNormalMaterial());
    this.object.add(this.textMesh);

    this.textMesh.position.x = 2;
    this.textMesh.position.y = 3;
    this.textMesh.position.z = 1.5;
  };

  Character.prototype.setMeshMaterial = function (material) {
    var children = this.object.children;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      child.material = material;
    }
  };

  Character.prototype.setTextMaterial = function (material) {
    this.textMesh.material = material;
  };

  Character.prototype.talk = function (text) {
    var textGeometry = new THREE.TextGeometry(text, {
      font   : this.font,
      size   : 2,
      height : 2.5
    });

    this.textMesh.geometry = textGeometry;
  };

  global.Character = Character;
})(window);
