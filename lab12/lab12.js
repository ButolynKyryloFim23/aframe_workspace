// import * as THREE from "three";
// import * as THREEx from "gps";

// import * as THREE from "../libs/three/three.module.min.js";

document.addEventListener("DOMContentLoaded", () =>
{

    // const start = async () =>
    // {
    //     const array = initThreeScene();
    //     const scene = array[0];
    //     const camera = array[1];
    //     const renderer = array[2];
    //
    //     const arjs = new THREEx.LocationBased(scene, camera);
    //
    // }
    // start();
});

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
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    return [scene, camera, renderer];
}