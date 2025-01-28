export default class RigidBody {
    readonly mass: number;
    readonly position: { x: number; y: number; z: number };
    readonly quaternion: { x: number; y: number; z: number; w: number };
    readonly size: { x: number; y: number; z: number };
    readonly AmmoInstance: any;
    private transform_: any;
    public body_: any;
    public motionState: any;
  
    constructor(
      AmmoInstance: any,
      mass: number,
      pos: { x: number; y: number; z: number },
      quat: { x: number; y: number; z: number; w: number },
      size: { x: number; y: number; z: number },shape: string
    ) {
      this.mass = mass;
      this.position = pos;
      this.quaternion = quat;
      this.size = size;
      this.AmmoInstance = AmmoInstance;
      this.transform_ = null;
      this.body_ = null;
      this.motionState = null;
      if(shape === "sphere"  || shape === "ball"){
        this.createSphereRigidBody(this.AmmoInstance);

      }else{
        this.createRigidBody(this.AmmoInstance);
        }
        
    }
  
    private createSphereRigidBody(AmmoInstance: any): void {
        this.transform_ = new AmmoInstance.btTransform();
    
        // Set the origin and rotation of the sphere
        const origin = new AmmoInstance.btVector3(
            this.position.x,
            this.position.y,
            this.position.z
        );
        const rotation = new AmmoInstance.btQuaternion(
            this.quaternion.x,
            this.quaternion.y,
            this.quaternion.z,
            this.quaternion.w
        );
    
        this.transform_.setOrigin(origin);
        this.transform_.setRotation(rotation);
    
        // Create a sphere shape (radius from `this.size.x` or directly set radius)
        const sphereRadius = this.size.x * 0.5; // Assuming size.x is the diameter
        const sphereShape = new AmmoInstance.btSphereShape(sphereRadius);
    
        this.motionState = new AmmoInstance.btDefaultMotionState(this.transform_);
    
        // Calculate local inertia
        const localInertia = new AmmoInstance.btVector3(0, 0, 0);
        if (this.mass !== 0) {
            sphereShape.calculateLocalInertia(this.mass, localInertia);
        }
    
        // Create rigid body construction info
        const rbInfo = new AmmoInstance.btRigidBodyConstructionInfo(
            this.mass,
            this.motionState,
            sphereShape,
            localInertia
        );
        this.body_ = new AmmoInstance.btRigidBody(rbInfo);
    
    
        // Get the initial motion state
        const motionState = this.body_.getMotionState();
        const transform = new AmmoInstance.btTransform();
        motionState.getWorldTransform(transform);
    }
  
    public getBody(): any {
      return this.body_;
    }

    public getPosition(): any {
        return this.body_.position;
      }
  
    public applyForce(force: { x: number; y: number; z: number }): void {
      const btForce = new this.AmmoInstance.btVector3(force.x, force.y, force.z);
      this.body_.applyCentralForce(btForce);
    }
    private createRigidBody(AmmoInstance: any): void {
      this.transform_ = new AmmoInstance.btTransform();
  
      const origin = new AmmoInstance.btVector3(
        this.position.x,
        this.position.y,
        this.position.z
      );
      const rotation = new AmmoInstance.btQuaternion(
        this.quaternion.x,
        this.quaternion.y,
        this.quaternion.z,
        this.quaternion.w
      );
      
      this.transform_.setOrigin(origin);
      this.transform_.setRotation(rotation);
  
      const boxShape = new AmmoInstance.btBoxShape(
        new AmmoInstance.btVector3(
          0.5 * this.size.x,
          0.5 * this.size.y,
          0.5 * this.size.z
        )
      );
  
      this.motionState = new AmmoInstance.btDefaultMotionState(this.transform_);
      const localInertia = new AmmoInstance.btVector3(0, 0, 0);
  
      if (this.mass !== 0) {
        boxShape.calculateLocalInertia(this.mass, localInertia);
      }
  
      const rbInfo = new AmmoInstance.btRigidBodyConstructionInfo(
        this.mass,
        this.motionState,
        boxShape,
        localInertia
      );
      this.body_ = new AmmoInstance.btRigidBody(rbInfo);
      this.body_.setGravity(new AmmoInstance.btVector3(0, -20, 0));

  
      const motionState = this.body_.getMotionState();
      const transform = new AmmoInstance.btTransform();
      motionState.getWorldTransform(transform);
    }
    
  }
  