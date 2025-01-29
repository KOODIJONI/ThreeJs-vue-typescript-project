import * as THREE from 'three';

export default class SetupSceneLighting {
    scene : any;
    player : any;
    dirLight : any;
  constructor(threeEnvironment: any,camera: any) {
    this.scene = threeEnvironment.scene;
    this.player = camera; // Assumes the player object is passed in the environment
    this.setupLights();
  }

  setupLights() {
    // Directional Light
    this.dirLight = new THREE.DirectionalLight(0xffffff, 10);
    this.dirLight.position.set(5, 10, 5);
    this.dirLight.castShadow = true;

    // Shadow camera settings for Directional Light
    this.dirLight.shadow.camera.near = 0.1;
    this.dirLight.shadow.camera.far = 200;
    this.dirLight.shadow.camera.left = -50;
    this.dirLight.shadow.camera.right = 50;
    this.dirLight.shadow.camera.top = 50;
    this.dirLight.shadow.camera.bottom = -50;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.radius = 5;
    this.dirLight.shadow.bias = -0.002; 
    this.scene.add(this.dirLight);

    // Additional Lighting: Point Light
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    this.scene.add(pointLight);

    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0x404040, 10); // Soft white light
    this.scene.add(ambientLight);

    // Optional: Add Axes Helper (for debugging)
    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);
  }

  update() {
    // Make the directional light follow the player
    if (this.player) {
      this.dirLight.position.set(
        this.player.position.x + 5,
        this.player.position.y + 10,
        this.player.position.z + 5
      );

      // Update shadow camera to maintain alignment
      this.dirLight.target.position.copy(this.player.position);
      this.dirLight.target.updateMatrixWorld(); // Ensure the target matrix is updated
    }
  }
}
