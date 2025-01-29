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
            return;
        }
        
        // If there's already a current animation, we want to fade it out before playing the new one
        if (this._currentAnimation) {
            const currentAction = this._animations[this._currentAnimation];
            if (currentAction) {
                // Crossfade to the new animation
                currentAction.fadeOut(2); // Fade out the current animation first
            }
        }
    
        this._currentAnimation = name;
        const newAction = action;
    
        // Now, set up the new action
        newAction.reset(); // Reset the new action if you want it to start from the beginning
        newAction.fadeIn(0.5); // Fade in the new action
        newAction.play();
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
                if(newAction){
                newAction.reset();
                console.log(newAction,prevAction);
                newAction.crossFadeFrom(prevAction, 0.1, true);
                newAction.play();
                }
            } 
        }

        }
    }
    jump() {
        if (!this._animations["jump"]) {
            return;
        }
    
        if (this._isJumping) {
            // If already jumping, ignore subsequent jump requests
            console.warn("Already jumping. Ignoring jump request.");
            return;
        }
    
        if (this._currentAnimation && this._animations[this._currentAnimation]) {
            const currentAction = this._animations[this._currentAnimation];
            currentAction.fadeOut(0.3); // Smoothly transition out of previous animation
        }
        // Set the jumping flag
        this._isJumping = true;
    
        // Save the current animation to return to later
        this._currentAnimation = "jump";
    
        // Play the jump animation
        const jumpAction = this._animations["jump"];
        jumpAction.setEffectiveTimeScale(1);
        jumpAction.reset().play();
    
        // Get the duration of the jump animation
        const jumpDuration = jumpAction.getClip().duration;
        jumpAction.loop = THREE.LoopOnce; 
        // After the jump animation ends, reset the flag and return to the previous animation
        setTimeout(() => {
            
        
            // Reset the jumping flag
            this._isJumping = false;
        
        }, jumpDuration * 1500); // Correct duration handling (in ms)
        
    }
    
    
    
}
