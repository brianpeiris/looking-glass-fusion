import * as THREE from "three";
import { STLLoader } from "./STLLoader";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
import { LookingGlassWebXRPolyfill, LookingGlassConfig } from "@lookingglass/webxr"
import FileWatcher from "./FileWatcher.js";

// Setup the rendering config
const config = LookingGlassConfig
config.tileHeight = 512
config.numViews = 45
config.targetY = 0
config.targetZ = 0
config.targetDiam = 3
config.fovy = (40 * Math.PI) / 180
new LookingGlassWebXRPolyfill()

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.append(renderer.domElement);
renderer.xr.enabled = true;

// Build the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('white');

scene.add(new THREE.AmbientLight(0x222222))


const directionalLight = new THREE.DirectionalLight()
// This is a significant performance tradeoff, disable shadows to increase framerate.
directionalLight.castShadow = true;
directionalLight.shadow.blur =1;
directionalLight.shadow.mapSize.width = directionalLight.shadow.mapSize.height =  renderer.capabilities.maxTextureSize; 
directionalLight.shadow.camera.zoom = 5;
directionalLight.shadow.camera.updateProjectionMatrix();

const modelGroup = new THREE.Group();
scene.add(modelGroup);
const modelMat = new THREE.MeshStandardMaterial({color: 'darkgrey'})

const loader = new STLLoader();

function loadFile() {
    loader.load("export.stl", geo => {
        geo.center();
        geo.computeBoundingSphere();
        const r = geo.boundingSphere.radius;
        geo.scale(1/r, 1/r, 1/r)

        const mesh = new THREE.Mesh(geo, modelMat);
        mesh.castShadow = mesh.receiveShadow = true;

        modelGroup.clear();
        modelGroup.add(mesh);
    });
}
loadFile();

const camera = new THREE.PerspectiveCamera();
camera.position.y = 10;
camera.position.z = 10;
camera.add(directionalLight)

scene.add(camera)


// Setup the scene in the renderer
renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });


// Attach window listeners
function resize() {
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    
}
window.addEventListener("resize", resize);
resize(); // Once right away for good measure (pun intended)

// Add a file watcher to reload our model as edits are made in Fusion360
new FileWatcher("export.stl", loadFile);

// Finally add the all important XHR button.
document.body.append(VRButton.createButton(renderer));
