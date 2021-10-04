import * as THREE from './threejs/three.module.js';
import {OrbitControls} from './threejs/OrbitControls.js';
import {GLTFLoader} from './threejs/GLTFLoader.js';

let scene, camera, renderer, container, clock, mixer, sphereCamera;

function init(){
    scene = new THREE.Scene();

    // camara
    // -->para esfera reflectora
    camera = new THREE.PerspectiveCamera(75,  window.innerWidth / window.innerHeight, 1, 5000);

    camera.position.set(0, 1, -5);
    

    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    container = document.getElementById("container");
    container.appendChild(renderer.domElement);

    let loader8 = new GLTFLoader();
    loader8.loadAsync('./3Dmodels/CesiumMan.glb').then((gltf)=>{
        mixer = new THREE.AnimationMixer(gltf.scene);
        var action = mixer.clipAction(gltf.animations[0]);
        action.play();
        scene.add(gltf.scene)
    })

    clock = new THREE.Clock();

    let control = new OrbitControls(camera, renderer.domElement);
    control.enableZoom = true;


    // -->para efera reflectora
    reflejo();

    // luces
    var light4 = new THREE.DirectionalLight(0xf6e86d, 1);
    light4.castSahdow = true;
    light4.shadow.mapSize.width = 2048;
    light4.shadow.mapSize.height = 2048;
    light4.position.set(500, 1500, 1000);
    light4.shadow.camera.far = 2500;
    light4.shadow.camera.left = -1000;
    light4.shadow.camera.right = 1000;
    light4.shadow.camera.top = 1000;
    light4.shadow.camera.bottom = -1000;
    light4.shadow.darkness = 0.2;
    scene.add(light4);

    var hemi = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5);
    hemi.position.set(0,0,5);
    scene.add(hemi);

    // -->para esfera reflectora
    render();

}

function reflejo(){
    let cubeRenderTarget = new THREE.WebGLCubeRenderTarget(
        1000, 
        { format:
            THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );

   sphereCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);
   sphereCamera.position.set(0, 0, 7);
   scene.add(sphereCamera);

   let sphereMaterial = new THREE.MeshBasicMaterial({
       envMap: sphereCamera.renderTarget
   });
   let sphereGeo = new THREE.BoxGeometry(10, 10, 10);
   let sphere = new THREE.Mesh(sphereGeo ,sphereMaterial);
   sphere.position.set(0, 0, 7);
   scene.add(sphere);
}

function render(){
    renderer.render(scene, camera);
    sphereCamera.updateCubeMap(renderer, scene);
    requestAnimationFrame(render);
    // -->para cesiumMan
    const delta2 = clock.getDelta();
    mixer.update(delta2);
}

init();