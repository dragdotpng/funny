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
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `https://api.ipinfo.ai/api/ip/${ip}/insights`,
            headers: headers,
            success: function (data) {
                resolve(data);
            },
            error: function () {
                reject("error");
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', async (event) => {
    const button = document.getElementById('button');
    const video = document.getElementById('video');

    const ip = await getip();
    let ipInfo = await iptoinfo(ip);

    ipInfo = Object.entries(ipInfo).reduce((acc, [key, value]) => {
        if (typeof value === 'object' && value !== null) {
            for (const [k, v] of Object.entries(value)) {
                acc[`${key}.${k}`] = v;
            }
        } else {
            acc[key] = value;
        }
        return acc;
    }, {});

    button.addEventListener('click', async () => {
        button.style.display = 'none';
        video.currentTime = 15;
        video.play();

        const ipInfoArray = Object.entries(ipInfo).map(([key, value]) => `${key}: ${value}`);

        let counter = 1;
        await new Promise(resolve => setTimeout(resolve, 500));

        const textElement = document.getElementById('text');
        const intervalId = setInterval(() => {
            if (counter < ipInfoArray.length) {
                textElement.innerHTML += ipInfoArray[counter] + '<br>';
                counter++;
                // Adjust font size based on the amount of text
                textElement.style.fontSize = `${120 / Math.sqrt(counter)}px`;
            } else {
                clearInterval(intervalId);
                video.pause();
            }
            document.body.appendChild(textElement);
        }, 500);
    });
});
