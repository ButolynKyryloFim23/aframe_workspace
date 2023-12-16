AFRAME.registerComponent('main', {

    tick: function (time, deltaTime)
    {
        for (let index = 1; index <= 3; index++)
        {
            const electron = document.querySelector('#electron' + index);
            if (electron == null)
            {
                continue;
            }
            let radius = parseInt  (electron.getAttribute("animationRadius"));
            let speed  = parseFloat(electron.getAttribute("animationSpeed" ));

            electron.setAttribute('position',
                {
                x: radius * Math.cos(speed * time / 1000),
                y: 0,
                z: radius * Math.sin(speed * time / 1000),
            });
        }
    }
});