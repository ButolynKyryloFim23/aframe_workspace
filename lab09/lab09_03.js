import * as THREE from '../libs/three/three.module.min.js';
import { FBXLoader } from '../libs/three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from '../libs/three/examples/jsm/loaders/GLTFLoader.js';
import { MindARThree } from "../libs/mindar/mindar-image-three.prod.js";

document.addEventListener("DOMContentLoaded", () =>
{
    const start = async() =>
    {
        const mindarThree = initMindArScene();
        const {scene, camera, renderer} = mindarThree;

        const padoruModel = await loadFbxModel('../assets/model/padoru_v3/Padoru_v3.1.fbx');

        let padoruVideo;
        if (true)
        {
            padoruVideo = await loadVideoFile('../assets/textures/padoru_padoru.mp4', false);
            document.body.appendChild(padoruVideo[1]);
        }
        else
        {
            padoruVideo = await loadVideoFile('VID', true);
        }


        padoruModel.position.setX(0);
        padoruModel.position.setY(0);
        padoruModel.position.setZ(0);

        scene.add(padoruModel);

        function animate()
        {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();

        initMakers(mindarThree, padoruModel, padoruVideo);

        await mindarThree.start();
    }
    start();
});


function initMakers(mindarThree, model01, model02)
{
    const marker01 = mindarThree.addAnchor(0);
    marker01.group.add(model01);
    {
        // Додавання світла
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // м'яке світло
        mindarThree.scene.add(ambientLight);
        marker01.group.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 1, 0); // напрям зверху
        mindarThree.scene.add(directionalLight);
        marker01.group.add(directionalLight);
    }

    const marker02 = mindarThree.addAnchor(1);
    marker02.group.add(model02[0]);

    marker02.onTargetFound = () =>
    {
        model02[0].visible = true;
        model02[0].needsUpdate = true;
        model02[1].play();
    }
    marker02.onTargetLost  = () =>
    {
        model02[0].visible = false;
        model02[1].pause();
    }
}

function initMindArScene()
{
    const mindarThree = new MindARThree(
        {
            container: document.body,
            imageTargetSrc: "../assets/markers/thumb_und_rutherford/targets.mind",
            maxTrack: 2,
            uiLoading: "no",
            uiScanning: "yes",
            uiError: "yes"
        }
    );

    return mindarThree;
}

// function initThreeScene()
// {
//     // Создаем сцену
//     const scene = new THREE.Scene();
//     // Додавання світла
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // м'яке світло
//     scene.add(ambientLight);
//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//     directionalLight.position.set(0, 1, 0); // напрям зверху
//     scene.add(directionalLight);
//     // Добавляем основной компонент
//     scene.add(new THREE.Object3D());
//     // Создаем камеру
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
//     // camera.position.set(0, 1, 0); // Позиция над сферами
//     // camera.lookAt(new THREE.Vector3(0, 0, 0)); // Направление в центр сцены
//     camera.position.setZ(1);
//     // Создаем рендерер
//     const renderer = new THREE.WebGLRenderer({ alpha: true});
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     document.body.appendChild(renderer.domElement);
//     return [scene, camera, renderer];
// }

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

async function loadVideoFile(path, isTag)
{
    let videoElement;
    if (isTag)
    {
        videoElement = document.querySelector('#' + path);
    }
    else
    {
        videoElement = document.createElement("video");
        videoElement.src = path;
        videoElement.loop = true;
        // videoElement.muted = true;
        videoElement.setAttribute("style", "display: none; ");
        videoElement.setAttribute("playsinline", "");
        // videoElement.playsinline = "";
        videoElement.scr = path;
    }
    const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry( 1, 720/1080 ),
        new THREE.MeshBasicMaterial( { map: new THREE.VideoTexture(videoElement) } )
    );
    // mesh.rotation.z = Math.PI / 2
    return [mesh, videoElement]
}