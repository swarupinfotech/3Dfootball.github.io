console.log("Textures may take some time to Load")

window.onload = () => {

const gui = new dat.GUI();
const stats = new Stats();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 250);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const controls = new THREE.OrbitControls(camera, renderer.domElement);
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const ballMap = 'https://i.imgur.com/ChcHBJb.jpg'
const floorMap = "https://i.imgur.com/iq8WtBC.jpg"
const floorNormal = "https://i.imgur.com/pgD3aSQ.jpeg"
const bgpx = 'https://i.imgur.com/mPJjok7.jpg'
const bgpy = 'https://i.imgur.com/YC5byrR.jpg'
const bgpz = 'https://i.imgur.com/CGWpOZG.jpg'
const bgnx = 'https://i.imgur.com/6FwrTfI.jpg'
const bgny = 'https://i.imgur.com/7i3rQ8g.jpg'
const bgnz = 'https://i.imgur.com/RL5o2LC.jpg'

camera.position.set(0, 10, 20);
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight);
controls.autoRotate = true;
controls.enableDamping = true;
controls.enablePan = false;

document.body.style.margin = 0;
document.body.appendChild(stats.domElement);
document.body.appendChild(renderer.domElement);

scene.background = cubeTextureLoader.load([
    bgpx, 
    bgnx, 
    bgpy, 
    bgny, 
    bgpz, 
    bgnz
])
const axesHelper = new THREE.AxesHelper(2);
axesHelper.visible = false;
scene.add(axesHelper);
gui.add(axesHelper, 'visible').name('Axes Helper');

const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);


const LightFolder = gui.addFolder('Light');
LightFolder.add(directionalLight.position, 'x').min(-30).max(30).step(0.01);
LightFolder.add(directionalLight.position, 'y').min(-30).max(30).step(0.01);
LightFolder.add(directionalLight.position, 'z').min(-30).max(30).step(0.01);
LightFolder.add(directionalLight, 'intensity').min(0).max(2).step(0.01);
LightFolder.add(ambientLight, 'intensity').min(0).max(1).step(0.01).name('Ambient Intensity')
LightFolder.add(directionalLight, 'castShadow').name('Cast Shadow');

const pointLightHelper = new THREE.PointLightHelper(directionalLight, 1);
pointLightHelper.visible = false;
scene.add(pointLightHelper);
LightFolder.add(pointLightHelper, 'visible').name('Light Helper');

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
directionalLightCameraHelper.visible = false;
scene.add(directionalLightCameraHelper);
LightFolder.add(directionalLightCameraHelper, 'visible').name('Camera Helper');



const floorGeo = new THREE.BoxGeometry(20, 0.5, 20, 10, 1, 10);
const floorMat = new THREE.MeshStandardMaterial({
    roughness: 0.35,
    map: textureLoader.load(floorMap, (map) => { map.wrapS = map.wrapT = THREE.RepeatWrapping; map.repeat.set(2, 2); return map }),
    normalMap: textureLoader.load(floorNormal, (map) => { map.wrapS = map.wrapT = THREE.RepeatWrapping; map.repeat.set(2, 2); return map }),
});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.position.set(0, -0.5, 0);
floor.receiveShadow = true;
floor.material.normalScale.set(4, 4)
scene.add(floor);

const floorFolder = gui.addFolder('Floor');
floorFolder.add(floor.material, 'wireframe').name('Show Wireframe');
floorFolder.add(floor, 'receiveShadow').name('Receive Shadow');
floorFolder.add(floor.scale, 'x').min(0.2).max(2).step(0.01);
floorFolder.add(floor.scale, 'z').min(0.2).max(2).step(0.01);
floorFolder.add(floor.material, 'roughness').min(0).max(1).step(0.01);
floorFolder.add(floor.material.normalScale, 'x').min(0).max(20).step(0.01).name('Normal Scale').onChange(() => { floor.material.normalScale.y = floor.material.normalScale.x; })


const ballGeo = new THREE.SphereGeometry(1.5, 32, 32);
const ballMat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(ballMap),
    roughness: 0.35,
});
const ball = new THREE.Mesh(ballGeo, ballMat);
ball.position.set(0, 5, 0);
ball.castShadow = true;
scene.add(ball);

const ballFolder = gui.addFolder('Ball');
ballFolder.add(ball.material, 'wireframe').name('Show Wireframe');
ballFolder.add(ball, 'castShadow').name('Cast Shadow');
ballFolder.add(ball.position, 'x').min(-5).max(5).step(0.01);
ballFolder.add(ball.position, 'z').min(-5).max(5).step(0.01);
ballFolder.add(ball.material, 'roughness').min(0).max(1).step(0.01);
ballFolder.add(ball.scale, 'x').min(0.2).max(2).step(0.01).name('Scale').onChange(() => {
    ball.scale.y = ball.scale.x;
    ball.scale.z = ball.scale.x;
});

gsap.to(ball.position, {
    duration: 2,
    y: 1.25,
    repeat: -1,
    yoyo: true,
    ease: 'bounce.out'
})

// gsap.to(ball.rotation, {
//     duration: 3,
//     z: Math.PI,
//     x: Math.PI,
//     repeat: -1,
//     ease: 'none'
// })

const animate = (t) => {
    stats.begin()
    controls.update();
    renderer.render(scene, camera);
    stats.end()
    requestAnimationFrame(animate);
}

animate()

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})}