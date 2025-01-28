
import ObjectAdder from './objectAdder';
import type { ObjectInfo } from '../utils/types';

let objectAdder: ObjectAdder | null = null;
export default function SetupScene(AmmoInstance: any,physicsWorld_: any, threeEnvironment_: any,animationHandler:any):any{
    
    objectAdder = new ObjectAdder(AmmoInstance,physicsWorld_,threeEnvironment_,animationHandler);

    const cube1: ObjectInfo = {
        castShadow: true,
        recieveShadow: false,
        mass: 1,
        pos: { x: -3, y: 100, z: 1 },
        quat: { x: 10, y: 1, z: 0, w: 0 },
        size: { x: 5, y: 5, z: 5 },
        metalness: 0.7,
        roughness: 0.0
      };
      const cube2: ObjectInfo = {
        castShadow: true,
        recieveShadow: false,
        mass: 1,
        pos: { x: -3, y: -100, z: 1 },
        quat: { x: 10, y: 1, z: 0, w: 0 },
        size: { x: 5, y: 5, z: 5 },
        metalness: 0.7,
        roughness: 0.0
      };
      const cube3: ObjectInfo = {
        castShadow: true,
        recieveShadow: false,
        mass: 1,
        pos: { x: -30, y: 1, z: 1 },
        quat: { x: 10, y: 1, z: 0, w: 0 },
        size: { x: 5, y: 5, z: 5 },
        metalness: 0.7,
        roughness: 0.0
      };
      
      objectAdder.addSphere(cube1);
      objectAdder.addSphere(cube2);
      objectAdder.addSphere(cube3);
      
   

    const ground: ObjectInfo = {
        castShadow: true,
        recieveShadow: true,
        mass: 0,
        pos: { x: 0, y: 0, z: 0 },
        quat: { x: 0, y: 1, z: 0, w: 0 },
        size: { x: 200, y: 1, z: 200 }
        ,shape: "Sphere"
      };
    objectAdder.addCube(ground);

    const MonitorInfo: ObjectInfo = {
      castShadow: true,
      recieveShadow: false,
      mass: 1,
      pos: { x: 0.1, y: 2.0, z: -1 },
      quat: { x: 0, y: Math.PI, z: 0, w: 0 },
      size: { x: 15, y: 10, z: 10},
      metalness: 0.7,
      roughness: 0.0
    };
    
    objectAdder.addGltf('obj/Monitor.glb');
    console.log(objectAdder.addFBX());
  
   
   
    objectAdder= null;
}