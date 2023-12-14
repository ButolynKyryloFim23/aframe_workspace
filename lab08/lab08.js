import * as three from '../libs/three/three.min.js';
import * as THREE from '../libs/three/three.module.min.js';

import { MindARThree } from '../libs/mindar/mindar-image-three.prod.js';


document.addEventListener("DOMContentLoaded", () => {
    const start = async() =>
    {
        console.log("meow")
        createModel();
    }
    start();
});

// AFRAME.registerComponent('main', {
//
//     tick: function (time, deltaTime)
//     {
//         for (let index = 1; index <= 3; index++)
//         {
//             const electron = document.querySelector('#electron' + index);
//
//             let radius = parseInt  (electron.getAttribute("animationRadius"));
//             let speed  = parseFloat(electron.getAttribute("animationSpeed" ));
//
//             electron.setAttribute('position',
//                 {
//                     x: radius * Math.cos(speed * time / 1000),
//                     y: 0,
//                     z: radius * Math.sin(speed * time / 1000),
//                 });
//         }
//     }
// });

async function createModel()
{
    const mindarThree = new MindARThree(
        {
            container: document.body,
            imageTargetSrc: "../assets/pattern-ruther_ford.mind",
        });

    const scene = mindarThree.scene;

    // const scanEntity = document.createElement("a-entity");
    const scanEntity = new THREE.Object3D();
    scanEntity.targetIndex = 0;
    scene.add(scanEntity);

    {
        // const scaleEntity = document.createElement("a-entity");
        const scaleEntity = new THREE.Object3D(
            {
                scale : "0.025 0.025 0.025",
            }
        );
        scanEntity.add(scaleEntity);

        {
            const nucleus = new THREE.SphereGeometry(
                {
                    id: "nucleus",
                    position: "0 0 0",
                    radius: "3.0"
                }
            );
            // const nucleusTexture = document.createElement("a-entity");
            const nucleusTexture = new THREE.Object3D();
            nucleus.Texturegeometry = "primitive: sphere; radius: 3.1";
            nucleus.Texturematerial = "src: url(../assets/waternormals.jpg);";
            // nucleus.appendChild(nucleusTexture);
            scaleEntity.add(nucleus);
        }

        {
            // const orbits = document.createElement("a-entity");
            const orbits = new THREE.Object3D(
                {
                    id : "orbits"
                }
            );

            const radius = [6.0, 9.0, 14.0];
            for (let index = 0; index < 3; index++) {
                orbits.add(new THREE.TorusGeometry(
                    {
                        position: "0 0 0",
                        radius: radius[index],
                        rotation: "90 0 0",
                        color: "#222",
                        tube : 0.1
                    }));
            }
            scaleEntity.add(orbits);
        }

        {
            const radius = [6.0, 9.0, 14.0];
            const speed = [0.5, 0.3, 0.2];
            const visibleRadius = [0.5, 1.0, 1.5];
            const visibleColor = ["blue", "yellow", "orange"];
            for (let index = 0; index < 3; index++) {
                // const electron = document.createElement("a-entity");
                const electron = new THREE.Object3D(
                    {
                        id : "electron" + (index + 1)
                    }
                );
                electron.animationRadius    = radius[index];
                electron.animationSpeed     = speed [index]
                electron.add(new THREE.SphereGeometry(
                    {
                        radius: visibleRadius[index],
                        color: visibleColor[index],
                    }
                ));
                scaleEntity.add(electron);
            }
        }
        // const mainEntity = scaleEntity.add("a-entity");
        const mainEntity = new THREE.Object3D("main");
        scaleEntity.add(mainEntity)
    }
    // document.body.appendChild(mindarThree.scene);

    console.log(document)

    await mindarThree.start();
}