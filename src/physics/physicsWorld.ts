import * as THREE from 'three';

export default class PhysicsWorld {
  private physicsWorld_: any = null;
  readonly rigidBodies: { mesh: THREE.Mesh; rigidBody: any }[] = [];
  readonly AmmoInstance: any;
  private tmpTransform: any = null;
  private collisionConfiguration_: any;
  private dispather_: any;
  private broadphase_: any;
  private solver_: any;

  constructor(AmmoInstance: any) {
    this.AmmoInstance = AmmoInstance;
    this.init()
  }

  
  init():void{

    this.collisionConfiguration_ = new this.AmmoInstance.btDefaultCollisionConfiguration();
    this.dispather_ = new this.AmmoInstance.btCollisionDispatcher(this.collisionConfiguration_);
    this.broadphase_ = new this.AmmoInstance.btDbvtBroadphase();
    this.solver_ = new this.AmmoInstance.btSequentialImpulseConstraintSolver();
    this.physicsWorld_ = new this.AmmoInstance.btDiscreteDynamicsWorld(
      this.dispather_,
      this.broadphase_,
      this.solver_,
      this.collisionConfiguration_
    );
    this.tmpTransform = new this.AmmoInstance.btTransform();
  }

  
  addRigidBody(rigidBody: any, mesh: THREE.Mesh): void {
    if (this.physicsWorld_) {
      this.rigidBodies.push({ mesh, rigidBody }); // Add the rigid body to the physics world
      this.physicsWorld_.addRigidBody(rigidBody.body_);
    } else {
      console.warn('Physics world not initialized yet');
    }
  }

  getPhysicsWorld(): any {
    return this.physicsWorld_;
  }

  cleanupAmmoObject(obj: any): void {
    if (typeof obj?.['delete'] === 'function') {
        obj.delete();
    }
  }

  // Update the physics world and synchronize the meshes
  update(): void {
    if (this.physicsWorld_) {
      const deltaTime = 1 / 60; // Assuming you're using 60 FPS
      this.physicsWorld_.stepSimulation(deltaTime, 10);

      // Synchronize meshes with their rigid bodies
      for (const rigidBodyData of this.rigidBodies) {
        const { mesh, rigidBody } = rigidBodyData;
        const motionState = rigidBody.body_.getMotionState();
        const transform = this.tmpTransform; // Or equivalent constructor

        if (motionState) {
          motionState.getWorldTransform(transform);
          const origin = transform.getOrigin();
          const rotation = transform.getRotation();
          mesh.position.set(origin.x(), origin.y(), origin.z());
          mesh.rotation.setFromQuaternion(
            new THREE.Quaternion(rotation.x(), rotation.y(), rotation.z(), rotation.w())
          );

          this.cleanupAmmoObject(transform);
        }
      }
    } else {
      console.warn('Physics world not initialized yet');
    }
  }
}
