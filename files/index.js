import "https://unpkg.com/three@0.133.1/build/three.min.js"
import "https://unpkg.com/three@0.133.1/examples/js/loaders/STLLoader.js"
import "https://unpkg.com/three@0.133.1/examples/js/controls/OrbitControls.js"
import "https://unpkg.com/holoplay@1.0.3/dist/holoplay.min.js"

import FileWatcher from "./FileWatcher.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color('white');

scene.add(new THREE.AmbientLight(0x222222))
const directionalLight = new THREE.DirectionalLight()
directionalLight.castShadow = true;
directionalLight.shadow.blur = 1;
directionalLight.shadow.mapSize.width = directionalLight.shadow.mapSize.width =  1024;
directionalLight.shadow.camera.zoom = 5;
directionalLight.shadow.camera.updateProjectionMatrix();

const modelGroup = new THREE.Group();
scene.add(modelGroup);
const modelMat = new THREE.MeshStandardMaterial({color: 'darkgrey'})

const loader = new THREE.STLLoader();

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

new FileWatcher("export.stl", loadFile);

const camera = new HoloPlay.Camera();
camera.position.y = 10;
camera.position.z = 10;
camera.add(directionalLight)
scene.add(camera)

const renderer = new HoloPlay.Renderer({tileCount: new THREE.Vector2(10,18), quiltResolution: 8192});
renderer.webglRenderer.shadowMap.enabled = true;
renderer.webglRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.append(renderer.domElement);
new THREE.OrbitControls(camera, renderer.domElement);

function loop() {
    requestAnimationFrame(loop);
    renderer.render(scene, camera)
}
requestAnimationFrame(loop);
