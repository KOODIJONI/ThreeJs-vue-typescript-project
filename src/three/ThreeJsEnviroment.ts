import * as THREE from 'three';

export default class ThreeJsEnvironment {
    public scene: THREE.Scene;
    readonly camera: THREE.PerspectiveCamera;
    readonly renderer: THREE.WebGLRenderer;
    readonly clock: THREE.Clock;

    constructor(container: HTMLElement) {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb); 
        
        this.camera = new THREE.PerspectiveCamera(
            75, // Field of view
            window.innerWidth / window.innerHeight, // Aspect ratio
            0.1, 
            1000 
        );
        this.camera.position.set(0, 5, 10);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1; 
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        
        container.appendChild(this.renderer.domElement);
        
        this.clock = new THREE.Clock();


        window.addEventListener('resize', () => this.onWindowResize());
    }

    private onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public render(): void {
        this.renderer.render(this.scene, this.camera);
    }

    public addObject(object: THREE.Object3D): void {
        this.scene.add(object);
    }

    public removeObject(object: THREE.Object3D): void {
        this.scene.remove(object);
    }
}
