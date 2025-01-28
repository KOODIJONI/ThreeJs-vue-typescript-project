import * as THREE from 'three';
import RigidBody from '../physics/RigidBody';

export default class CameraControl {
    readonly AmmoInstance: any;
    readonly scene: THREE.Scene;
    readonly physicsWorld: any;
    readonly camera: THREE.PerspectiveCamera;
    readonly rbCamera: any;

    private keys: Record<string, boolean>;
    private lastSpacePress: number;
    readonly force: any;
    readonly tempDirection: THREE.Vector3;
    readonly tempFacingPosition: THREE.Vector3;
    readonly tempNormalVector: THREE.Vector3;
    readonly tempReferenceVector: THREE.Vector3;
    readonly rotation: THREE.Quaternion;
    private pitch: number;
    private yaw: number;
    readonly cameraMesh: any;
    private readonly MIN_PITCH: number;
    private readonly MAX_PITCH: number;
    private readonly offset:THREE.Vector3;
    constructor(
        AmmoInstance: any,
        camera: THREE.PerspectiveCamera,
        
        scene: THREE.Scene,
        physicsWorld: any
    ) {
        this.AmmoInstance = AmmoInstance;
        this.scene = scene;
        this.physicsWorld = physicsWorld;
        this.camera = camera;
        const cameraGeometry = new THREE.BoxGeometry(1, 0.3, 1);
        const cameraMaterial = new THREE.MeshStandardMaterial();
        this.cameraMesh = new THREE.Mesh(cameraGeometry, cameraMaterial);
        this.cameraMesh.position.set(0, 1, 5);
        this.cameraMesh.receiveShadow = false;
        this.cameraMesh.castShadow = true;
        this.scene.add(this.cameraMesh);
        this.offset = new THREE.Vector3(0, 2, 0);
        this.rbCamera = new RigidBody(
        this.AmmoInstance,
        10,
        this.cameraMesh.position,
        this.cameraMesh.quaternion,
        new THREE.Vector3(1, 0.3, 1)
        ,"cube"
        );

        this.physicsWorld.addRigidBody(this.rbCamera,this.cameraMesh);

        // State variables
        this.keys = {};
        this.lastSpacePress = 0;
       
        this.MIN_PITCH = -Math.PI / 2; // -90 degrees
        this.MAX_PITCH = Math.PI / 2;

        // Physics setup
        this.rbCamera.body_.setDamping(0.8, 0.8);
        this.rbCamera.body_.setAngularFactor(new this.AmmoInstance.btVector3(0, 0, 0)); // Lock angular rotation
        this.force = new this.AmmoInstance.btVector3(0, 0, 0);

        // Temp objects for calculations
        this.tempDirection = new THREE.Vector3();
        this.tempFacingPosition = new THREE.Vector3();
        this.tempNormalVector = new THREE.Vector3();
        this.tempReferenceVector = new THREE.Vector3(0, 1, 0);
        this.rotation = new THREE.Quaternion();
        this.pitch = 0; 
        this.yaw = 0;
    }

    public setupControls(): void {
        window.addEventListener('keydown', (event: KeyboardEvent) => {
            this.keys[event.key] = true;
        });

        window.addEventListener('keyup', (event: KeyboardEvent) => {
            this.keys[event.key] = false;
        });

        
    }

    public updateCameraPosition(): void {
        
        const currentTime = Date.now();
        this.force.setValue(0, 0, 0);

        const addedAmount = 200;

        if (this.keys['w'] || this.keys['W']) {
            
            const direction = this.calculateCameraFacingPosition();
            this.force.setValue(
                this.force.x() + direction.x * addedAmount,
                this.force.y(),
                this.force.z() + direction.z * addedAmount
            );
           
        }

        if (this.keys['s'] || this.keys['S']) {
            const direction = this.calculateCameraFacingPosition();
            this.force.setValue(
                this.force.x() - direction.x * addedAmount,
                this.force.y(),
                this.force.z() - direction.z * addedAmount
            );
        }

        if (this.keys['a'] || this.keys['A']) {
            const direction = this.calculateNormalVector(this.calculateCameraFacingPosition());
            this.force.setValue(
                this.force.x() - direction.x * addedAmount,
                this.force.y(),
                this.force.z() - direction.z * addedAmount
            );
        }

        if (this.keys['d'] || this.keys['D']) {
            const direction = this.calculateNormalVector(this.calculateCameraFacingPosition());
            this.force.setValue(
                this.force.x() + direction.x * addedAmount,
                this.force.y(),
                this.force.z() + direction.z * addedAmount
            );
        }
        
        if (this.keys['ArrowRight']) this.yaw -= 0.03;
        if (this.keys['ArrowLeft']) this.yaw += 0.03;
        if (this.keys['ArrowDown']) this.pitch -= 0.03;
        if (this.keys['ArrowUp']) this.pitch += 0.03;

        this.pitch = Math.max(this.MIN_PITCH, Math.min(this.MAX_PITCH, this.pitch));

        if (this.keys[' ']) {
            if (currentTime - this.lastSpacePress >= 1000) {
                this.force.setValue(this.force.x(), 8000, this.force.z());
                this.lastSpacePress = currentTime;
            }
        }
        
        this.rbCamera.body_.activate();
        this.rbCamera.body_.applyForce(this.force, this.rbCamera.body_.getCenterOfMassTransform().getOrigin());

        this.camera.position.lerp(this.cameraMesh.position.clone().add(this.offset), 0.4);

        this.updateCameraRotation();
    }

    private updateCameraRotation(): void {
        const yawQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
        const pitchQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.pitch);

        this.rotation.copy(yawQuat).multiply(pitchQuat);
        this.camera.quaternion.copy(this.rotation);
    }

    private calculateCameraFacingPosition(): THREE.Vector3 {
        this.camera.getWorldDirection(this.tempDirection);
        return this.tempDirection.normalize();
    }

    private calculateNormalVector(directionVector: THREE.Vector3): THREE.Vector3 {
        this.tempNormalVector.crossVectors(directionVector, this.tempReferenceVector);
        if (this.tempNormalVector.length() === 0) {
            this.tempNormalVector.crossVectors(directionVector, new THREE.Vector3(0, 1, 0));
        }
        return this.tempNormalVector.normalize();
    }
}
