import * as THREE from 'three'

export default function setupSceneLighting(threeEnvironment_: any){
            const scene: any = threeEnvironment_.scene;
            const dirLight = new THREE.DirectionalLight(0xffffff, 10);
            const axes = new THREE.AxesHelper(5);
            scene.add(axes);
            dirLight.position.set(5, 10, 5);
            dirLight.castShadow = true;
            
            dirLight.shadow.camera.near = 0.1;   
            dirLight.shadow.camera.far = 200;    
            dirLight.shadow.camera.left = -100;   
            dirLight.shadow.camera.right = 100;   
            dirLight.shadow.camera.top = 100;     
            dirLight.shadow.camera.bottom = -100; 
    
            dirLight.shadow.mapSize.width = 2048;   
            dirLight.shadow.mapSize.height = 2048;
    
            const light = new THREE.PointLight(0xffffff, 1);
            light.position.set(10, 10, 10);
            scene.add(light);
            scene.add(dirLight);
    
            const ambientLight = new THREE.AmbientLight(0x404040, 10); // Soft white light
            scene.add(ambientLight);
}
    