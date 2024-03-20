import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const createGUI = () => {
    let guiEvents = {
        spinRight: function (e) {
            group.rotation.y -= 0.25
            controls.update()
        },
        spinLeft: function () {
            group.rotation.y += 0.25
            controls.update()
        },
        forward: function () {
            group.rotation.x -= 0.25
            controls.update()
        },
        backward: function () {
            group.rotation.x += 0.25
            controls.update()
        },
        right: function () {
            group.rotation.z += 0.25
            controls.update()
        },
        left: function () {
            group.rotation.z -= 0.25
            controls.update()
        },
    }

    let gui = new GUI()

    const guiConfig = [
        {
            name: "SpinRight",
            functionKey: "spinRight",
        },
        {
            name: "SpinLeft",
            functionKey: "spinLeft",
        },
        {
            name: "Forward",
            functionKey: "forward",
        },
        {
            name: "Backward",
            functionKey: "backward",
        },
        {
            name: "Right",
            functionKey: "right",
        },
        {
            name: "Left",
            functionKey: "left",
        },
    ]

    guiConfig.forEach(config => {
        gui.add(guiEvents, config.functionKey).name(config.name)
    })
}

const canvas = document.querySelector('canvas.webgl')

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 2
scene.add(camera)

const gltfLoader = new GLTFLoader()

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

const controls = new OrbitControls(camera, canvas)

const animate = () => {
    renderer.render(scene, camera)
    controls.update()
    window.requestAnimationFrame(animate)
}

animate()

const draggingSpace = document.getElementById('draggingSpace');

draggingSpace.addEventListener('dragover', (event) => {
  event.preventDefault();
  draggingSpace.style.backgroundColor = 'rgba(5, 74, 158, 0.5)';
});

draggingSpace.addEventListener('dragenter', (event) => {
  event.preventDefault();
  draggingSpace.style.backgroundColor = 'rgba(5, 74, 158, 0.5)';
});

draggingSpace.addEventListener('dragleave', (event) => {
  event.preventDefault();
  draggingSpace.style.backgroundColor = ''; // Alanın rengini sıfırla
});

draggingSpace.addEventListener('drop', (event) => {
  event.preventDefault();
  draggingSpace.style.backgroundColor = ''; // Alanın rengini sıfırla
  const file = event.dataTransfer.files[0];
  if (file && isAcceptedFileType(file)) {
    handleFileUpload(file);
  }
});

document.getElementById("fileInput").addEventListener("change", function(event) {
    const file = event.target.files[0]
    if (file && isAcceptedFileType(file)) {
        handleFileUpload(file);
    }
})

function isAcceptedFileType(file) {
    const acceptedTypes = ['model/obj', 'model/stl', 'model/gltf', 'model/glb']; // Kabul edilen dosya tipleri
    return acceptedTypes.includes(file.type);
}

function handleFileUpload(file) {
    const reader = new FileReader()
    reader.onload = function(e) {
        const data = e.target.result
        loadModel(data);
    }
    reader.readAsDataURL(file)
}

function loadModel(modelData) {
    const loader = new GLTFLoader();
    loader.load(modelData, (gltf) => {
        scene.add(gltf.scene);
    });
}
