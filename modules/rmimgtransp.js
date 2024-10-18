const input = document.querySelector(".module_contents input");
const canvas = document.querySelector(".module_contents canvas");
const ctx = canvas.getContext("2d");

const upload = document.querySelector(".module_contents div .upload");
const download = document.querySelector(".module_contents .download");
const slider = document.querySelector(".module_contents input[type='range']");
const sliderValue = document.querySelector(".module_contents span");
const again = document.querySelector(".module_contents div .again");
const module_contents = document.querySelector(".module_contents");

slider.addEventListener("input", (event)=>{
    sliderValue.innerHTML = `accepts alpha <= ${slider.value}`;
})

upload.addEventListener("click", () => {
    input.click();
});

input.addEventListener("change", rmbgr);
input.addEventListener("change", ()=>{
    again.style.visibility = "visible";
});

again.addEventListener("click", ()=>{
    input.dispatchEvent(new Event("change"));
});

let hasListener = false;

function rmbgr(event) {
    const file = event.target.files[0];
    if (!file) return;

    const img = new Image();
    const url = URL.createObjectURL(file);


    img.src = url;
    img.onload = function () {

        canvas.style.height = `200px`;
        const newWidth = img.width*(200/img.height);
        canvas.style.width = `${newWidth}px`;
        canvas.height = 200;
        canvas.width = newWidth;
        ctx.clearRect(0, 0, canvas.width, canvas.height);


        ctx.drawImage(img, 0, 0, 200, newWidth);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const alpha = data[i + 3];

            if (alpha <= slider.value) {
                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;
                data[i + 3] = 255;
            }
        }

        ctx.putImageData(imageData, 0, 0);

        URL.revokeObjectURL(url);

        canvas.style.visibility = "visible";
        download.style.visibility = "visible";

        if(hasListener) return;
        download.addEventListener("click", ()=>{
            const output = canvas.toDataURL("image/png");
            fetch(output)
                .then(res => res.blob())
                .then(blob => {
                let downloadLink = document.createElement("a");
                downloadLink.setAttribute("download", "output.png");
                downloadLink.href = URL.createObjectURL(blob);
                console.log(URL.createObjectURL(blob));
                document.body.appendChild(downloadLink);
                downloadLink.click();
                URL.revokeObjectURL(downloadLink.href);
                document.body.removeChild(downloadLink);
            });
        });

        hasListener = true;
    };
}