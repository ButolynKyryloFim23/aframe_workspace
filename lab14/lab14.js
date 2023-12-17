import { MindARThree } from '../libs/mindar/mindar-face-three.prod.js';
import * as faceapi from '../libs/faceapi/face-api.esm.js';

const expr =
    [
        "neutral",
        "happy",
        "sad",
        "angry",
        "fearful",
        "disgusted",
        "surprised"
    ];

document.addEventListener("DOMContentLoaded", () =>
{
    const start = async() =>
    {
        const mindarThree = new MindARThree(
            {
                container: document.body,
                uiLoading: "yes",
                uiScanning: "no",
                uiError: "no"
            });
        const {renderer, scene, camera, video} = mindarThree;

        await loadFaceapiNetwork();
        console.log("models loaded");

        await mindarThree.start();
        console.log("mindar started");

        await writeInfoFromFrame(renderer, scene, camera, mindarThree.video);
    }
    start();
});

async function loadFaceapiNetwork()
{
    await faceapi.nets.ssdMobilenetv1.load("../assets/aimodel/faceapi/");
    await faceapi.nets.tinyFaceDetector.load("../assets/aimodel/faceapi/");
    await faceapi.nets.faceLandmark68Net.load("../assets/aimodel/faceapi/");
    await faceapi.nets.faceExpressionNet.load("../assets/aimodel/faceapi/");
    await faceapi.nets.ageGenderNet.load("../assets/aimodel/faceapi/");
};

async function writeInfoFromFrame(renderer, scene, camera, video)
{
    let frame = 0;

    renderer.setAnimationLoop(
        async() =>
        {
            if (frame++ % 10 === 0)
            {
                const div_info = document.getElementById("info");
                const result = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceExpressions().withAgeAndGender();
                if (result != null)
                {
                    let str = "";
                    str += "Стать " + (result["gender"] === "male" ? "чоловіча" : "жіноча") + " ";
                    str += "(ймовірність правильного визначення - " + Math.round(100 * parseFloat(result["genderProbability"])) + "%" + ")" + "\<br\>";
                    str += "Вік - " + Math.round(parseFloat(result["age"])) + " років" + "<br>";
                    str += checkEmotion(result);
                    div_info.innerHTML = str;
                }
            }
        }
    )
    renderer.render(scene, camera);
}

function checkEmotion(result)
{
    const expressions = result["expressions"];
    if (expressions == null)
    {
        console.log("expressions is null");
        return "";
    }
    let emotion = expressions[expr[0]];
    let probability = 0;

    for (let index = 0; index < expr.length; index++)
    {
        if (expressions[expr[index]] > probability)
        {
            probability = expressions[expr[index]];
            emotion     = expr[index];
        }
    }

    return emotion + " (ймовірність правильного визначення - " + Math.round(100 * probability) + "%" + ")" + "<br>";
}