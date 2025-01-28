export default class AnimationHandler{
    _mixer: any;
    constructor(){
        this._mixer;


    }
    setMixer(mixer: any){
        this._mixer = mixer;
    }
    updateAnimation(deltaTime: number){
        if(this._mixer) this._mixer.update(deltaTime);

    }
}
