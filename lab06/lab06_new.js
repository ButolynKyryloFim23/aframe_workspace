let marker_visible = { A: false, B: false, C: false, D: false };
let lines = [];

AFRAME.registerComponent("registerevents",
{
    init: function ()
    {
        const marker = this.el;
        marker.addEventListener('markerFound', function ()
        {
            // console.log('Знайдено маркер ', marker.id);
            marker_visible[marker.id] = true;
        });
        marker.addEventListener('markerLost', function ()
        {
            // console.log('Втрачено маркер ', marker.id);
            marker_visible[marker.id] = false;
        });
    }
});

AFRAME.registerComponent("run",
    {
        init: function ()
        {
            this.A = document.querySelector("a-marker#A");
            this.B = document.querySelector("a-marker#B");
            this.C = document.querySelector("a-marker#C");
            this.D = document.querySelector("a-marker#D");
            this.AB = document.querySelector("#AB").object3D;
            this.BC = document.querySelector("#BC").object3D;
            this.CD = document.querySelector("#CD").object3D;
            this.DA = document.querySelector("#DA").object3D;

            const geometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 32);
            geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
            geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
            const material = new THREE.MeshBasicMaterial({color: 0xff0000});

            setMeshAndAdd(geometry, material, this.AB, this.lineAB);
            setMeshAndAdd(geometry, material, this.BC, this.lineBC);
            setMeshAndAdd(geometry, material, this.CD, this.lineCD);
            setMeshAndAdd(geometry, material, this.DA, this.lineDA);

            startThinking();
        }
    });

function startThinking()
{
    if (
           marker_visible["A"]
        && marker_visible["B"]
        && marker_visible["C"]
        && marker_visible["D"]
    )
    {
        for (const line of lines)
        {
            line.visible = true;
        }

        const vecA = new THREE.Vector3();
        const vecB = new THREE.Vector3();
        const vecC = new THREE.Vector3();
        const vecD = new THREE.Vector3();

        this.A.object3D.getWorldPosition(vecA);
        this.B.object3D.getWorldPosition(vecB);
        this.C.object3D.getWorldPosition(vecC);
        this.D.object3D.getWorldPosition(vecD);

        const distanceToAB = vecA.distanceTo(vecB);
        const distanceToBC = vecB.distanceTo(vecC);
        const distanceToCD = vecC.distanceTo(vecD);
        const distanceToDA = vecD.distanceTo(vecA);

        for (let index = 0; index < 4; index++)
        {
            const lookingOn = index === 0 ? vecB : index === 1 ? vecC : index === 2 ? vecD : vecA;
            const distanceTo= index === 0 ? distanceToAB : index === 1 ? distanceToBC : index === 2 ? distanceToCD : distanceToDA;
            lines[index].lookAt(lookingOn);
            lines[index].scale.set(1, 1, distanceTo);
        }

        console.log("Кількість можливих трикутників: " + factorial(Object.keys(marker_visible).length) / (factorial(3) * factorial(Object.keys(marker_visible).length - 3)));

        calculateTriangleParameters();
    }
    else
    {
        for (const line of lines)
        {
            line.visible = false;
        }
    }

    requestAnimationFrame(startThinking);
}



function setMeshAndAdd(geometry, material, markerid, line)
{
    line = new THREE.Mesh(geometry, material);
    line.visible = false;
    markerid.add(line);
    lines.push(line);
}

function calculateTriangleParameters()
{
    const arrayOfMarkers = Object.keys(marker_visible);
    for (let i = 0; i < arrayOfMarkers.length; i++)
    {
        for (let j = i + 1; j < arrayOfMarkers.length; j++)
        {
            for (let k = j + 1; k < arrayOfMarkers.length; k++)
            {
                const vec1 = new THREE.Vector3();
                const vec2 = new THREE.Vector3();
                const vec3 = new THREE.Vector3();

                this[arrayOfMarkers[i]].object3D.getWorldPosition(vec1);
                this[arrayOfMarkers[j]].object3D.getWorldPosition(vec2);
                this[arrayOfMarkers[k]].object3D.getWorldPosition(vec3);

                const side1 = vec1.distanceTo(vec2);
                const side2 = vec2.distanceTo(vec3);
                const side3 = vec3.distanceTo(vec1);

                // периметр
                const perimeter = side1 + side2 + side3;

                // за формулою Герона
                const semiPerimeter = perimeter / 2;
                const area = Math.sqrt(semiPerimeter * (semiPerimeter - side1) * (semiPerimeter - side2) * (semiPerimeter - side3));

                console.log(
                    "Можливий трикутник: " + arrayOfMarkers[i] + "-" + arrayOfMarkers[j] + "-" + arrayOfMarkers[k] + "\n" +
                    "Периметр трикутника: " + perimeter.toFixed(2) + "\n" +
                    "Площа трикутника: " + area.toFixed(2) + "\n"
                );
            }
        }
    }
}

// Функція для обчислення факторіалу
function factorial(n)
{
    return n <= 1 ? 1 : n * factorial(n - 1);
}

