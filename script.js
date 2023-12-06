function getip() {
    return new Promise((resolve, reject) => {
        $.getJSON("https://api.ipify.org?format=json")
            .done(function (data) {
                resolve(data.ip);
            })
            .fail(function () {
                reject("error");
            });
    });
}

function iptoinfo(ip) {
    return new Promise((resolve, reject) => {
        $.getJSON("https://ip-api.com/json/" + ip)
            .done(function (data) {
                resolve(data);
            })
            .fail(function () {
                reject("error");
            });
    });
}

document.addEventListener('DOMContentLoaded', async (event) => {
    const button = document.getElementById('button');

    const video = document.getElementById('video');

    const ip = await getip();

    const ipInfo = await iptoinfo(ip);

    button.addEventListener('click', async () => {
        button.style.display = 'none';
        video.currentTime = 15;
        video.play();

        const ipInfoArray = Object.entries(ipInfo).map(([key, value]) => `${key}: ${value}`);

        let counter = 1;

        await new Promise(resolve => setTimeout(resolve, 500));

        const intervalId = setInterval(() => {
            const textElement = document.getElementById('text');
            if (counter < ipInfoArray.length) {
                textElement.innerHTML += ipInfoArray[counter] + '<br>';
                counter++;
            } else {
                clearInterval(intervalId);
                video.pause();
            }
            document.body.appendChild(textElement);
        }, 500);
    });
});
