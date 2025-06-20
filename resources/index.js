
const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');

let width, height;
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}
resize();
window.addEventListener('resize', resize);

class Star {
    constructor() {
        this.reset();
    }
//a random starting position
    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speed = Math.random() * 0.5 + 0.2;
        this.opacity = Math.random();
        this.opacityChange = (Math.random() * 0.02) + 0.005;
    }
//draw a star(5 spikes)
    draw() {
        ctx.save();
        ctx.beginPath();

        const spikes = 5;
        const outerRadius = this.size * 3;
        const innerRadius = outerRadius / 2;
        let rot = Math.PI / 2 * 3;
        let x = this.x;
        let y = this.y;
        let step = Math.PI / spikes;

        ctx.moveTo(x, y - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = this.x + Math.cos(rot) * outerRadius;
            y = this.y + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = this.x + Math.cos(rot) * innerRadius;
            y = this.y + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(this.x, this.y - outerRadius);
        ctx.closePath();

        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.restore();
    }
//moving and twinkling
    update() {
        this.y += this.speed;
        this.opacity += this.opacityChange;
        if (this.opacity <= 0 || this.opacity >= 1)
            this.opacityChange *= -1;

        if (this.y > height)
            this.reset();
    }
}

const stars = [];
for (let i = 0; i < 100; i++)
stars.push(new Star());

function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let star of stars) {
        star.update();
        star.draw();
    }
    requestAnimationFrame(animate);
}

animate();

let cnt = document.querySelector(".container");
const envelopeEffect = () => {
    document.querySelector('#envelope').classList.toggle('open');
    document.querySelector('#firstmsg').classList.toggle('hid');
}
cnt.addEventListener("click", envelopeEffect);

const noRemove = (e) => {
    document.querySelector('#No-first').style.display = "none";
    let temp2 = document.querySelector('#Yes-first').style;
    temp2.width = "100%";
    e.stopPropagation();
}

//envelope area resizing
async function yesClick(e) {
    let temp = document.querySelector(".container");
    temp.removeEventListener("click", openEnvelope);
    temp.style.cursor = "auto";
    temp.style.width = "400px";
    temp.style.height = "350px";
    document.querySelector("#firstmsg").style.display = "none";
    document.querySelector("#askq").style.display = "block";
    nd = document.createElement("h2");
    nd.innerHTML = "Ummm..Okay";
    document.querySelector("#askq").prepend(nd);
    const msg = e.target.textContent;
    try{
        const response = await fetch("/response", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msg })
        });
        if (!response.ok)
            throw new Error("Failed to send");
    }
    catch(err){
    console.log(err);
    }
    e.stopPropagation();
}

var a = 1;
async function askMore(e) {
    document.querySelector("#response").style.display = "none";
    document.querySelector("#askq").style.display = "block";
    if (a === 1) {
        document.querySelector("#askq").removeChild(document.querySelector("#askq").firstChild)
        a--;
    }
    const response = await fetch("/clear");
    e.stopPropagation();
}

let btn = document.querySelector("#Yes-first");
btn.addEventListener("click", yesClick);
btn = document.getElementById("No-first");
btn.addEventListener("click", noRemove);

//user message handling
async function sendMessage(e) {
    const input = document.getElementById("msg");
    const message = input.value.trim();

    if (!message) {
        alert("Message cannot be empty!");
        return;
    }
    try {
        const response = await fetch("/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message })
        });
        if (!response.ok)
            throw new Error("Failed to send");
    }
    catch (error) {
        console.error("Error:", error);
        alert("Failed to send message!");
    }
    finally {
        input.value = "";
        document.querySelector("#response").style.display = "block";
        document.querySelector("#askq").style.display = "none";
        e.stopPropagation();
    }

}

document.querySelector("#sendbtn").addEventListener("click", sendMessage);
document.querySelector(".more").addEventListener("click", askMore);

document.getElementById("msg").addEventListener("keypress", (e) => {
    if (e.key === "Enter")
        sendMessage(e);
});

//reply handling
async function checkReply() {
    try {
        const result = await fetch("/receive");
        const data = await result.json();
        const chat = document.getElementById("chat");
        if (data.message) {
            chat.innerHTML = "<p><b>You:</b> " + data.message + "</p>";
        }
        else {
            chat.innerHTML = "<p>Typing...</p>"
        }
    }
    catch (error) {
        console.error('Error fetching message:', error);
    }

}
setInterval(checkReply, 1000);
