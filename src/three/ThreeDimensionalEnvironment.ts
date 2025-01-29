import PhysicsWorld from "../physics/physicsWorld";
import ThreeJsEnvironment from "./ThreeJsEnviroment";
import * as THREE from 'three';
import SetupScene from "./setupScene";
import setupSceneLighting from "./setupSceneLighting";
import CameraControl from "./cameraControl";
import AnimationHandler from "./animationHandler";

export default class ThreeDimensionalEnvironment {

    ammoInstance: any;
    physicsWorld: InstanceType<typeof PhysicsWorld> ;
    threeEnviroment: InstanceType<typeof ThreeJsEnvironment>;
    cameraControl: InstanceType<typeof CameraControl>;
    clock: InstanceType<typeof THREE.Clock>;
    animationHandler: InstanceType<typeof AnimationHandler>
    sceneLighting: InstanceType<typeof setupSceneLighting>
    keys: { [key: string]: boolean } = {};
    _mixer: any;
    constructor(ammo: any,element: HTMLElement) {
      this.clock = new THREE.Clock();
      this.ammoInstance = ammo; 
      this.physicsWorld = new PhysicsWorld(this.ammoInstance);
      this.threeEnviroment = new ThreeJsEnvironment(element);
      this.clock = new THREE.Clock();
      this.animationHandler = new AnimationHandler();
      this._mixer = SetupScene(this.ammoInstance,this.physicsWorld,this.threeEnviroment,this.animationHandler);
      this.sceneLighting = new setupSceneLighting(this.threeEnviroment,this.threeEnviroment.camera);
      this.cameraControl = new CameraControl(this.ammoInstance, this.threeEnviroment.camera,this.threeEnviroment.scene, this.physicsWorld, this.animationHandler);
      this.cameraControl.setupControls();
      this.threeEnviroment.camera.position.set(1,1,100);
      this.keys = {};
      document.addEventListener('keydown', (event) => {
        this.keys[event.key.toLowerCase()] = true; // Store pressed key
    });
    
    document.addEventListener('keyup', (event) => {
      this.keys[event.key.toLowerCase()] = false; // Remove released key
    });
    }
    public animate(): void {
          const animateLoop = () => {
              requestAnimationFrame(animateLoop);
              const moveSpeed = 0.1;
              if (this.keys['w']) this.threeEnviroment.camera.position.z -= moveSpeed; // debug
              if (this.keys['s']) this.threeEnviroment.camera.position.z += moveSpeed; // debug
              if (this.keys['a']) this.threeEnviroment.camera.position.x -= moveSpeed; // debug
              if (this.keys['d']) this.threeEnviroment.camera.position.x += moveSpeed; // debug
              if (this.keys['e']) this.threeEnviroment.camera.position.y -= moveSpeed; // debug
              if (this.keys['q']) this.threeEnviroment.camera.position.y += moveSpeed; // debug
              this.cameraControl.updateCameraPosition();
              this.physicsWorld.update();
              this.threeEnviroment.render(); 
              this.animationHandler.updateAnimation(0.01);
              this.sceneLighting.update();
              
          };
      
          animateLoop(); 
      }
  }