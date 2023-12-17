import { ARButton } from '../libs/three/examples/jsm/webxr/ARButton.js';
import * as THREE from "../libs/three/three.module.min.js";

document.addEventListener("DOMContentLoaded", () =>
{
    const start = async () =>
    {
        const array = initThreeScene();
        const scene = array[0];
        const camera = array[1];
        const renderer = array[2];

        const button = ARButton.createButton(renderer);
        document.body.appendChild(button);

        {
            const nucleusGeometry = new THREE.SphereGeometry(3.0, 32, 32);
            const nucleusMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('../assets/textures/waternormals.jpg') });
            const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
            setScale(nucleus);
            scene.add(nucleus);

            // Добавляем электроны
            const electron1 = createElectron(6, 0.5, 0.5, 0x0000FF);
            electron1.position.setX(6);
            const electron2 = createElectron(9, 0.3, 1.0, 0xFFFF00);
            electron2.position.setX(9);
            const electron3 = createElectron(14, 0.2, 1.5, 0xFFA500);
            electron3.position.setX(14);
            scene.add(electron1, electron2, electron3);
            const electrons = [electron1, electron2, electron3];

            // Добавляем орбиты
            const orbit1 = addOrbit(scene, 6, 0x222222);
            const orbit2 = addOrbit(scene, 9, 0x222222);
            const orbit3 = addOrbit(scene, 14, 0x222222);

            renderer.setAnimationLoop(() =>
            {
                for (let electron of electrons)
                {
                    let radius = parseInt(  electron.userData.radius) * electron.scale.getComponent(0);
                    let speed  = parseFloat(electron.userData.speed);

                    electron.position.setX(radius * Math.cos(speed * Date.now() / 1000));
                    electron.position.setY(0);
                    electron.position.setZ(radius * Math.sin(speed * Date.now() / 1000));
                }
                renderer.render(scene, camera);
            })

        }
    }
    start();


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
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);
    return [scene, camera, renderer];
}

function createElectron(animationRadius, animationSpeed, sphereRadius, color)
{
    const electronGeometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
    const electronMaterial = new THREE.MeshBasicMaterial({ color: color });
    const electron = new THREE.Mesh(electronGeometry, electronMaterial);
    setScale(electron);
    electron.userData = { radius: animationRadius, speed: animationSpeed };
    return electron;
}

function addOrbit(scene, radius, color)
{
    const orbitGeometry = new THREE.TorusGeometry(radius, 0.1, 32, 100);
    const orbitMaterial = new THREE.MeshBasicMaterial({ color: color });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    setScale(orbit);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);
    return orbit;
}

function setScale(object)
{
    object.scale.set(0.025, 0.025, 0.025);
}

function onWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}