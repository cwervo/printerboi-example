import PrinterBoi from 'https://unpkg.com/printerboi@0.0.1/index.js';

const CANVAS_SCALE = 1.0
function getWidth() {
    return window.innerWidth * CANVAS_SCALE
}
function getHeight() {
    return window.innerHeight * CANVAS_SCALE
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, getWidth()  / getHeight(), 0.1, 1000 );
let gltfLoader = new THREE.GLTFLoader();
let trackball, gameboyModel;

// Note 'preserveDrawingBuffer: true' below, this is important!
// Can cause artifacts[1], but should be okay for now with relatively simple scenes.
// TODO: Figure out how to do this for WebGL contexts without preserveDrawingBuffer turned on!
// 1: https://stackoverflow.com/questions/45221542/html-save-webgl-canvas-as-image#comment77422119_45223017
var renderer = new THREE.WebGLRenderer({
    antialias: false,
    transparent: false,
    preserveDrawingBuffer: true,
    powerPreference: 'low-power',
    failIfMajorPerformanceCaveat: true
});
renderer.setSize( getWidth(), getHeight() );

let printerButtonEl = addPrinterButton()
document.body.appendChild( renderer.domElement );

trackball = new Trackball(renderer.domElement, {startSpin: 0.01});

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x2EAFAC, wireframe: true } );

var light = new THREE.PointLight( 0xFFFFFF, 1, 100 );
light.position.set( 1, 1, 1 );
scene.add( light );
// Sets the GL clear color to ensure background is white
scene.background = new THREE.Color(0xFFFFFF)

// -------
// Load a glTF resource
gltfLoader.load(
// resource URL
    'gameboy.glb',
    // called when the resource is loaded
    function ( gltf ) {
        gameboyModel = gltf.scene
        scene.add( gltf.scene );
        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Scene
        gltf.scenes; // Array<THREE.Scene>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object
    },
    // called while loading is progressing
    function ( xhr ) { console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' ); },
    // called when loading has errors
    function ( error ) { console.log( 'An error happened' ); }
);

camera.position.z = 2;
camera.position.y += 0.75;

var animate = function () {
    requestAnimationFrame( animate );

    const m = new THREE.Matrix4();
    const mat = trackball.getMatrix();
    m.fromArray(mat)
    if (gameboyModel != undefined) {
        gameboyModel.rotation.setFromRotationMatrix(m)
    }

    renderer.render( scene, camera );
};

animate();

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
    camera.aspect = getWidth() / getHeight();
    camera.updateProjectionMatrix();
    renderer.setSize( getWidth(), getHeight());
}

function addPrinterButton() {
    let printerButton = document.createElement('button')
    printerButton.classList.add('printerButton')
    printerButton.innerHTML = `Hit me to print! <img src="printer.png" alt="printer image"/>`
    document.body.appendChild(printerButton)
    return printerButton
}


printerButtonEl.onclick = () => {
    console.log('hey')
    let domTexture = new THREE.Texture(renderer.domElement)
    // window.domTexture = domTexture
    // Need to figure out how to get this from WebGL rather than just THREE!!
    let pb = new PrinterBoi(domTexture)
    pb.printPopup()
}

