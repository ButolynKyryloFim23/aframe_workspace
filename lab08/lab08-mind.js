import * as THREE from '../libs/three/three.module.min.js';

import { MindARThree } from '../libs/mindar/mindar-image-three.prod.js';

document.addEventListener("DOMContentLoaded", () => {
    const start = async() =>
    {
        console.log("meow")
        await createAltModel();
    }
    start();
});

async function createAltModel()
{
    // Создаем сцену
    // Создаем экземпляр MindARThree
    const mindarThree = new MindARThree({
        container: document.body,
        imageTargetSrc: '../assets/markers/rutherford/pattern-ruther_ford.mind',
        uiLoading: "no",
        uiScanning: "yes",
        uiError: "yes",
        debug: "yes",
    });

    const {scene, camera, renderer } = mindarThree;

    const anchor = mindarThree.addAnchor(0);

    // Добавляем ядро атома
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

    anchor.group.add(nucleus, electron1, electron2, electron3, orbit1, orbit2, orbit3);


    await mindarThree.start();
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