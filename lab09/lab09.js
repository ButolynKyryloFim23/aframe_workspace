import * as THREE from '../libs/three/three.module.min.js';
import { FBXLoader } from '../libs/three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from '../libs/three/examples/jsm/loaders/GLTFLoader.js';

document.addEventListener("DOMContentLoaded", () =>
{
    const start = async() =>
    {
        const padoruModel = await loadFbxModel('../assets/model/padoru_v3/Padoru_v3.1.fbx');
        // const padoruVideo = await loadVideoFile('../assets/textures/padoru-padoru.mp4');


        const array = initThreeScene();
        const scene = array[0];
        const camera = array[1];
        const renderer = array[2];

        padoruModel.position.setX(0);
        padoruModel.position.setY(0);
        padoruModel.position.setZ(0);
        // padoruModel.scale = "5 5 5";

        scene.add(padoruModel);

        function animate()
        {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();
    }
    start();
});




// async function initMindArScene()
// {
//     const mindarThree = new MindARThree({
//         container: document.body,
//         imageTargetSrc: "assets/drugs_and_cup.mind",
//         maxTrack: 3,
//         uiLoading: "no",
//         uiScanning: "yes",
//         uiError: "yes"
//     });
//
//     return mindarThree;
// }

function initThreeScene()
{
    // Создаем сцену
    const scene = new THREE.Scene();
    // Додавання світла
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // м'яке світло
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0); // напрям зверху
    scene.add(directionalLight);
    // Добавляем основной компонент
    scene.add(new THREE.Object3D());
    // Создаем камеру
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
    // camera.position.set(0, 1, 0); // Позиция над сферами
    // camera.lookAt(new THREE.Vector3(0, 0, 0)); // Направление в центр сцены
    camera.position.setZ(1);
    // Создаем рендерер
    const renderer = new THREE.WebGLRenderer({ alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    return [scene, camera, renderer];
}

async function loadFbxModel(path)
{
    const loader = new FBXLoader();
    const texture = await loadTexture('../assets/model/padoru_v3/Padoru_Tex.png');
    return new Promise((resolve) =>
    {
        loader.load(path, (model) =>
        {
            model.traverse((child) =>
            {
                if (child.isMesh)
                {
                    // Для каждого материала в модели
                    child.material.map = texture;
                }
            });
            resolve(model);
        });
    });
}
async function loadGltfModel(path)
{
    const loader = new GLTFLoader();

    return new Promise((resolve) =>
    {
        loader.load(path, (model) =>
        {
            resolve(model.scene);
        });
    });
}

async function loadTexture(path)
{
    const textureLoader = new THREE.TextureLoader();
    return new Promise((resolve) =>
    {
        textureLoader.load(path, (texture) =>
        {
            resolve(texture);
        });
    });
}

async function loadVideoFile(path)
{
    const videoElement = document.createElement("video");
    if (videoElement != null)
    {
        return new Promise((resolve, reject) =>
        {
            videoElement.addEventListener("loadeddata", () =>
            {
                video.setAttribute("playsinline", "");
                resolve(video);
            })
            video.src = path;
            video.loop = true;
            video.muted = true;
            video.autoplay = true;
        });
    }
    return null;
}