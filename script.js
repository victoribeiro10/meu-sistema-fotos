window.onload = function () {
    loadGallery();
    checkAdmin();
};

// ======================
// ADMIN VIA URL
// ======================
function checkAdmin() {

    const url = new URL(window.location.href);
    const isAdmin = url.searchParams.get("admin");

    if (isAdmin !== "true") return;

    if (sessionStorage.getItem("adminUnlocked") === "true") {
        enableAdmin();
        return;
    }

    const user = prompt("Login:");
    const pass = prompt("Senha:");

    if (user === "admin" && pass === "entreclick2026") {

        sessionStorage.setItem("adminUnlocked", "true");
        enableAdmin();

    } else {
        alert("Acesso negado");
    }
}

function enableAdmin() {
    document.getElementById("clearBtn").style.display = "block";
    document.getElementById("downloadBtn").style.display = "block";
}

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

    document.getElementById("msg").innerText = "Enviando foto...";

    const formData = new FormData();
    formData.append("image", file);

    try {

        const apiKey = "SUA_API_KEY_IMGBB";

        const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${apiKey}`,
            { method: "POST", body: formData }
        );

        const data = await response.json();

        if (data.success) {

            const url = data.data.url;

            saveImage(url);
            addToGallery(url);

            document.getElementById("msg").innerText =
            "💖 Foto enviada com sucesso!";

        } else {
            document.getElementById("msg").innerText =
            "Erro no upload";
        }

    } catch (err) {
        document.getElementById("msg").innerText =
        "Erro de conexão";
    }
}

// ======================
// SALVAR LOCAL
// ======================
function saveImage(url) {

    let images =
    JSON.parse(localStorage.getItem("gallery")) || [];

    images.push(url);

    localStorage.setItem(
        "gallery",
        JSON.stringify(images)
    );
}

// ======================
// CARREGAR GALERIA
// ======================
function loadGallery() {

    let images =
    JSON.parse(localStorage.getItem("gallery")) || [];

    const div = document.getElementById("gallery");

    div.innerHTML = "";

    images.forEach(url => addToGallery(url));
}

// ======================
// EXIBIR IMAGEM
// ======================
function addToGallery(url) {

    const div = document.getElementById("gallery");

    const img = document.createElement("img");
    img.src = url;

    div.appendChild(img);
}

// ======================
// LIMPAR GALERIA
// ======================
function clearGallery() {

    localStorage.removeItem("gallery");

    document.getElementById("gallery").innerHTML = "";

    document.getElementById("msg").innerText =
    "✔ Galeria limpa!";
}

// ======================
// BAIXAR TODAS
// ======================
function downloadAll() {

    let images =
    JSON.parse(localStorage.getItem("gallery")) || [];

    let content = images.join("\n");

    const blob = new Blob([content], {
        type: "text/plain"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "urls.txt";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    localStorage.removeItem("gallery");

    document.getElementById("gallery").innerHTML = "";

    alert("Enviado para o sistema!");
}
```

# IMPORTANTE

## 📁 Agora sua pasta fica assim:

```txt
meu-sistema-fotos/
 ├── index.html
 ├── style.css
 ├── script.js
 └── logo.png
```

## 📌 Você precisa:

1. salvar sua logo com nome:

```txt
logo.png
```

2. colocar dentro da pasta do projeto

3. trocar isso no script.js:

```js
const apiKey = "SUA_API_KEY_IMGBB";
```

pela sua API real do ImgBB.
