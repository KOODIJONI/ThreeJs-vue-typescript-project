import * as THREE from "three";
export default class AnimationHandler{
    _mixer: any;
    _animations: { [key: string]: any };
    _currentAnimation: string;
    _animatedPlayer: any;
    private readonly Playeroffset:THREE.Vector3;
    private _isJumping: boolean = false;
    constructor(){
        this._mixer = null;
        this._animations = {};
        this._currentAnimation = "idle";
        this._animatedPlayer= null;
        this.Playeroffset = new THREE.Vector3(0, -2, 0);
        

    }
    setPlayerObject(player: any){

        this._animatedPlayer = player;
    }
    addAnimation(name: string, clip: any) {
        if (!this._mixer) {
          throw new Error("Mixer is not set. Call setMixer() before adding animations.");
        }
    
        // Create an action from the clip and store it
        const action = this._mixer.clipAction(clip);
        this._animations[name] = action;
      }
    
      playAnimation(name: string) {
        const action = this._animations[name];
        if (!action) {
          throw new Error(`Animation '${name}' not found. Add it first using addAnimation().`);
        }
        this._currentAnimation = name;
        // Play the animation action
        action.reset(); // Ensure it starts from the beginning
        action.play();
      }
    
      stopAnimation(name: string) {
        if (this._animations[name]) {
        const action = this._animations[name];
        if (action) {
          action.stop(); 
        }
        }
      }
    setMixer(mixer: any){
        
        this._mixer = mixer;
    }
    updateAnimation(deltaTime: number){
        if(this._mixer) this._mixer.update(deltaTime);

    }
    
    
    selectAnimationByVelocity(magnitude: number,angle : any,position:any) {
        if(this._animatedPlayer){
        let targetAnimation: string;
        const xRotation = new THREE.Quaternion();
        xRotation.setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(180));
        this._animatedPlayer.position.lerp(position.add(this.Playeroffset), 0.4)

        const currentQuaternion = new THREE.Quaternion().copy(angle);

        this._animatedPlayer.quaternion.copy(currentQuaternion.multiply(xRotation));
        
        if (magnitude < 1) {
            targetAnimation = "idle";
        } else if (magnitude < 5) {
            targetAnimation = "walk";
        } else {
            targetAnimation = "run";
        }
    
        // Only switch animations if the target animation is different
        if (this._currentAnimation !== targetAnimation&&!this._isJumping
        ) {
            const previousAnimation = this._currentAnimation;
            this._currentAnimation = targetAnimation;
    
            // If a previous animation exists, smoothly crossfade to the new one
            if (previousAnimation&&this._animations[targetAnimation]) {
                const prevAction = this._animations[previousAnimation];
                const newAction = this._animations[targetAnimation];
    
                // Set blending options
                newAction.reset();
                newAction.crossFadeFrom(prevAction, 0.5, true); // 0.5 seconds blend duration
                newAction.play();
            } else {
                // If there's no previous animation, simply play the new animation
                this.playAnimation(targetAnimation);
                
            }
        }

        }
    }
    jump() {
        if (!this._animations["jump"]) {
            throw new Error("Jump animation is not defined. Add it first using addAnimation().");
        }
    
        if (this._isJumping) {
            // If already jumping, ignore subsequent jump requests
            console.warn("Already jumping. Ignoring jump request.");
            return;
        }
    
        // Set the jumping flag
        this._isJumping = true;
    
        // Save the current animation to return to later
        const previousAnimation = this._currentAnimation;
        this._currentAnimation = "jump";
    
        // Play the jump animation
        const jumpAction = this._animations["jump"];
        jumpAction.setEffectiveTimeScale(1);
        jumpAction.reset().play();
        jumpAction.setLoop(THREE.LoopOnce);
        
    
        // Get the duration of the jump animation
        const jumpDuration = jumpAction.getClip().duration;
    
        // After the jump animation ends, reset the flag and return to the previous animation
        setTimeout(() => {
            if (this._currentAnimation === "jump") {
                // Prevent override during jump, return to previous animation
                this._currentAnimation = previousAnimation;
                this.playAnimation(previousAnimation || "idle");
                console.log(previousAnimation);
            }
    
            // Reset the jumping flag
            this._isJumping = false;
            
        }, jumpDuration * 1500); // Convert duration to milliseconds
    }
    
    
}
