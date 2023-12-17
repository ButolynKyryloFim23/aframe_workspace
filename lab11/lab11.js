import * as THREE from '../libs/three/three.module.min.js';
import {MindARThree} from "../libs/mindar/mindar-face-three.prod.js";
import {FBXLoader} from "../libs/three/examples/jsm/loaders/FBXLoader.js";

document.addEventListener("DOMContentLoaded", () =>
{
    const start = async() =>
    {
        const mindArThree = initMindArScene();

        const padoruModel = await loadFbxModel('../assets/model/padoru_v3/Padoru_v3.1.fbx');

        await initPadoruMarker(mindArThree, padoruModel);

        await initFaceMask(mindArThree, "../assets/model/facemask/canonical_face_model_uv_visualization.png")

        await mindArThree.start();

        mindArThree.renderer.setAnimationLoop( () =>
        {
            padoruModel.rotation.y += 0.1;

            mindArThree.renderer.render(mindArThree.scene, mindArThree.camera);
        });
    }
    start();
});

async function initPadoruMarker(mindArThree, padoruModel)
{
    const padoruModelMarker = mindArThree.addAnchor(454);
    padoruModelMarker.group.add(padoruModel);

    padoruModel.position.setX(-0.5);
    padoruModel.position.setY(0.7);
}

async function initFaceMask(mindArThree, path)
{
    const {scene} = mindArThree;

    {   // ініціюємо освітелння, а то будемо бачити чорну маску
        const light1 = new THREE.AmbientLight( 0xFFFFFF, 1.5 ); // soft white light
        scene.add( light1 );
        const light2 = new THREE.HemisphereLight( 0xffffff, 0xdddddd, 1.5 ); // soft white light
        scene.add( light2 );
    }

    const faceMesh = mindArThree.addFaceMesh();
    faceMesh.material.transparent = true;
    //faceMesh.material.wireframe = true;
    //faceMesh.material.opacity = 0.5;
    faceMesh.material.map = await loadTexture("../assets/model/facemask/canonical_face_model_uv_visualization.png");
    scene.add(faceMesh);
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

function initMindArScene()
{
    const mindarThree = new MindARThree(
        {
            container: document.body,
            uiLoading: "no",
            uiScanning: "yes",
            uiError: "yes"
        }
    );
    mindarThree.userData = { counter : 0 };
    return mindarThree;
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