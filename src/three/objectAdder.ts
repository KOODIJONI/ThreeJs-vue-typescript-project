import * as THREE from 'three'
import RigidBody from '../physics/RigidBody';
import type { ObjectInfo } from '../utils/types';
import { MTLLoader, OBJLoader, GLTFLoader } from 'three/examples/jsm/Addons.js';
import { Mesh, Object3D  } from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'; 

export default class ObjectAdder{
    readonly Ammo: any;
    readonly physicsWorld: any;
    readonly threeEnvironment: any;
    readonly mtlLoader: MTLLoader;
    readonly fbxLoader: FBXLoader;
    readonly objLoader: OBJLoader;
    readonly gltfloader: GLTFLoader;
    _animationHandler: any;
    _mixer: any;
    constructor(AmmoInstance: any,physicsWorld_: any, threeEnvironment_: any,animationHandler:any) {
        this.Ammo = AmmoInstance;
        this.physicsWorld = physicsWorld_;
        this.threeEnvironment= threeEnvironment_;
        this.mtlLoader = new MTLLoader();
        this.objLoader = new OBJLoader();
        this.gltfloader = new GLTFLoader();
        this.fbxLoader = new FBXLoader();
        this._animationHandler = animationHandler;
        this._mixer;
    }
    addCube(object:ObjectInfo) : void{
        
        
        const geometry = new THREE.BoxGeometry(object.size.x,object.size.y,object.size.z);

        let color:number = 0x00ff00

        if(object.color){
            color = object.color;
        }

        let metalness:number = 0

        if(object.metalness){
            metalness =object.metalness;
        }
                  
        let roughness:number = 1
        if(object.roughness){
            roughness =object.roughness;
        }
        
        const material = new THREE.MeshStandardMaterial({ color: color, metalness: metalness ,roughness : roughness});

        const cube = new THREE.Mesh(geometry, material);
        cube.castShadow = object.castShadow;
        cube.receiveShadow= object.recieveShadow;
    
        const position = { x: object.pos.x, y: object.pos.y, z: object.pos.z };
        const quaternion = { x: object.quat.x, y: object.quat.y, z: object.quat.z, w: object.quat.w };
        const size = { x: object.size.x, y: object.size.y, z: object.size.z };
    
        const rigidBody = new RigidBody(this.Ammo, object.mass, position, quaternion, size,"cube");
        
    
        this.threeEnvironment.addObject(cube);
        this.physicsWorld.addRigidBody(rigidBody,cube);
    }
    addSphere(object:ObjectInfo) : void{
        
        
        const geometry = new THREE.SphereGeometry(object.size.x/2);

        let color:number = 0x00ff00

        if(object.color){
            color = object.color;
        }

        let metalness:number = 0

        if(object.metalness){
            metalness =object.metalness;
        }
                  
        let roughness:number = 1
        if(object.roughness){
            roughness =object.roughness;
        }
        
        const material = new THREE.MeshStandardMaterial({ color: color, metalness: metalness ,roughness : roughness});

        const cube = new THREE.Mesh(geometry, material);
        cube.castShadow = object.castShadow;
        cube.receiveShadow= object.recieveShadow;
    
        const position = { x: object.pos.x, y: object.pos.y, z: object.pos.z };
        const quaternion = { x: object.quat.x, y: object.quat.y, z: object.quat.z, w: object.quat.w };
        const size = { x: object.size.x, y: object.size.y, z: object.size.z };
    
        const rigidBody = new RigidBody(this.Ammo, object.mass, position, quaternion, size,"sphere");
        
    
        this.threeEnvironment.addObject(cube);
        this.physicsWorld.addRigidBody(rigidBody,cube);
    }
    addObjWithMtl(pathOBJ:string, pathMTL:string) {
        
    
        this.mtlLoader.load(
            pathMTL, // Path to the MTL file
            (materials) => {
                materials.preload(); // Preload the materials for use with OBJLoader
                
                // Load OBJ file with materials
                
                this.objLoader.setMaterials(materials); // Apply the materials to OBJLoader
        
        
            this.objLoader.load(
                pathOBJ,
                (object) => {
                    this.threeEnvironment.scene.add(object);
                    console.log('Object loaded successfully.');
                    object.position.set(10,10,10);
                    object.scale.set(10,10,10);
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
                },
                (error) => {
                    console.error('An error occurred while loading the OBJ file.', error);
                }
            );
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.error('An error occurred while loading the MTL file.', error);
        }
    );
       
    }
    addGltf(pathGLTF:string) {
         // Create an instance of GLTFLoader
    
        this.gltfloader.load(
            pathGLTF, // Path to the GLTF file
            (gltf) => {
                const object:Object3D = gltf.scene; // Access the scene from the loaded GLTF file
                if (object instanceof Mesh) {
                    const mesh = object as Mesh;
                    mesh.traverse((child) => {
                        if (child instanceof THREE.Mesh) {
                        child.castShadow = true;    // Enable casting shadows
                        child.receiveShadow = true; // Enable receiving shadows
            
                        if (child.material) {
                            child.material.shadowSide = THREE.DoubleSide; // Shadows on both sides of the material
                        }
                    }
                });
            }
                this.threeEnvironment.scene.add(object); // Add the object to the scene
                console.log('GLTF object loaded successfully.');
    
                // Set position, scale, or rotation if needed
                object.position.set(10, 1.7, 10);
                object.scale.set(5, 5, 5);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded'); // Log loading progress
            },
            (error) => {
                console.error('An error occurred while loading the GLTF file.', error); // Handle errors
            }
        );
    }
    addFBX(): any{
       
          
          // Load the second FBX model ("Ty.fbx")
        this.fbxLoader.load( 'characters/Ty.fbx', ( fbx ) => {
            fbx.castShadow= true;
            fbx.receiveShadow = true;
            fbx.traverse(c =>{
                c.castShadow= true;
                fbx.receiveShadow = true;
            });
            fbx.scale.setScalar(0.1);
            

          this.fbxLoader.load( 'characters/Running.fbx', ( object ) => {
            this._mixer = new THREE.AnimationMixer(fbx);
            
            
            const idleClip = object.animations[0]; // Assuming the first animation is idle

            const idleAction = this._mixer.clipAction(idleClip); // Create a ClipAction object
            this._animationHandler.setMixer(this._mixer);
            idleAction.play();
            

          }, 
          // onProgress callback (optional)
          ( xhr ) => {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
          }, 
          // onError callback
          ( error ) => {
            console.error( error );
          } );
          this.threeEnvironment.scene.add( fbx ); 
          


        
    }, 
    // onProgress callback (optional)
    ( xhr ) => {
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    }, 
    // onError callback
    ( error ) => {
      console.error( error );
    } );

    return this._mixer;
    }
    
    
}