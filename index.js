import * as THREE from 'three';
import * as PB from 'printerboi';
import Trackball from 'gltumble';

let mesh;
let renderer;
let scene;
let camera;
let trackball;

window.addEventListener( 'resize', onWindowResize, false );

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    camera.position.z = 0.4;

    scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    const material = new THREE.MeshNormalMaterial();

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    scene.background = new THREE.Color(0xFFFFFF);

    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    trackball = new Trackball(renderer.domElement, {startSpin: 0.01});
    document.body.appendChild( renderer.domElement );

}

function animate() {

    requestAnimationFrame( animate );

    const m = new THREE.Matrix4();
    const mat = trackball.getMatrix();
    m.fromArray(mat)
    mesh.rotation.setFromRotationMatrix(m)

    renderer.render( scene, camera );

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

document.querySelector('#floating-message').onclick = () => {
    console.log('hey')
    let domTexture = new THREE.Texture(renderer.domElement)
    // window.domTexture = domTexture
    // Need to figure out how to get this from WebGL rather than just THREE!!
    let pb = new PB.PrinterBoi(domTexture)
    pb.printPopup()
}