import * as THREE from '../libs/three/three.module.min.js';

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
    const scene = new THREE.Scene();

    // Добавляем ядро атома
    const nucleusGeometry = new THREE.SphereGeometry(3.0, 32, 32);
    const nucleusMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('../assets/textures/waternormals.jpg') });
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    // nucleus.scale.set(0.025, 0.025, 0.025);
    scene.add(nucleus);

    // Добавляем электроны
    const electron1 = createElectron(6, 0.5, 0.5, 0x0000FF);
    electron1.position.setX(6);
    const electron2 = createElectron(9, 0.3, 1.0, 0xFFFF00);
    electron1.position.setX(9);
    const electron3 = createElectron(14, 0.2, 1.5, 0xFFA500);
    electron1.position.setX(14);
    scene.add(electron1, electron2, electron3);
    const electrons = [electron1, electron2, electron3];

    // Добавляем орбиты
    addOrbit(scene, 6, 0x222222);
    addOrbit(scene, 9, 0x222222);
    addOrbit(scene, 14, 0x222222);

    // Добавляем небо
    const skyGeometry = new THREE.SphereGeometry(100, 32, 32);
    const skyMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);

    // Добавляем плоскость
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -20;
    scene.add(plane);

    // Добавляем основной компонент
    const main = createMain();
    scene.add(main);

    // Создаем камеру
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 30, 0); // Позиция над сферами
    camera.lookAt(new THREE.Vector3(0, 0, 0)); // Направление в центр сцены


    // Создаем рендерер
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Добавляем анимацию
    function animate()
    {
        requestAnimationFrame(animate);
        // main.rotation.y += 0.005; // Добавляем вращение основного компонента
        for (let electron of electrons)
        {
            let radius = parseInt(  electron.userData.radius);
            let speed  = parseFloat(electron.userData.speed);

            electron.position.setX(radius * Math.cos(speed * Date.now() / 1000));
            electron.position.setY(0);
            electron.position.setZ(radius * Math.sin(speed * Date.now() / 1000));
        }
        renderer.render(scene, camera);
    }

    animate();
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
    // object.scale.set(0.025, 0.025, 0.025);
}

function createMain()
{
    const main = new THREE.Object3D();
    main.userData = { angle: 0 };
    return main;
}