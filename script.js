```js
// ======================
// INIT
// ======================
window.onload = function () {
    loadGallery();
};

// ======================
// UPLOAD IMGBB
// ======================
async function uploadImage() {

    const input = document.getElementById("file");

    if (!input.files.length) {
        alert("Selecione uma imagem");
        return;
    }

    const file = input.files[0];

    document.getElementById("msg").innerText = "Enviando...";

    const formData = new FormData();
    formData.append("image", file);

    try {

        const apiKey = "4ec4f650a2cf5d5bb8b35cf85edc9941";

        const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${apiKey}`,
            { method: "POST", body: formData }
        );

        const data = await response.json();

        if (data.success) {

            const url = data.data.url;

            saveImage(url);
            addToGallery(url);

            document.getElementById("msg").innerText = "✔ Foto enviada com sucesso!";
        } else {
            document.getElementById("msg").innerText = "Erro no upload";
        }

    } catch (err) {
        document.getElementById("msg").innerText = "Erro de conexão";
    }
}
```
