const input = document.querySelector(".module_contents input");
const canvas = document.querySelector(".module_contents canvas");
const ctx = canvas.getContext("2d");

const upload = document.querySelector(".module_contents .upload");
const download = document.querySelector(".module_contents .download");
const slider = document.querySelector(".module_contents input[type='range']");
const sliderValue = document.querySelector(".module_contents span");

slider.addEventListener("input", (event)=>{
    sliderValue.innerHTML = `Accepts alpha <= ${slider.value}`;
    input.dispatchEvent(new Event("change"));
})

upload.addEventListener("click", () => {
    input.click();
});

input.addEventListener("change", rmbgr);

function rmbgr(event) {
    const file = event.target.files[0];
    if (!file) return;

    const img = new Image();
    const url = URL.createObjectURL(file);


    img.src = url;
    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0);

        // Get the image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Loop through every pixel (4 values per pixel: R, G, B, A)
        for (let i = 0; i < data.length; i += 4) {
            const alpha = data[i + 3];

            // If pixel is transparent, set it to white
            if (alpha <= slider.value) {
                data[i] = 255;     // Red
                data[i + 1] = 255; // Green
                data[i + 2] = 255; // Blue
                data[i + 3] = 255; // Alpha (fully opaque)
            }
        }

        // Put the modified image data back on the canvas
        ctx.putImageData(imageData, 0, 0);

        // Revoke the URL to free up resources
        URL.revokeObjectURL(url);

        canvas.style.height = `${img.height}px`;
        canvas.style.width = `${img.width}px`;
        canvas.style.visibility = "visible";
        download.style.visibility = "visible";

        download.addEventListener("click", ()=>{
            const output = canvas.toDataURL("image/png");
            fetch(output)
            .then(res => res.blob())
            .then(blob => {
                const link = document.createElement("a");
                link.setAttribute("download", "output");
                link.href = URL.createObjectURL(blob);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        });
    };
}