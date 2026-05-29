// ======================
// SUPABASE
// ======================

const supabaseUrl = "https://scwznirvzwrphztvopbz.supabase.co";

const supabaseKey = "SEU_ANON_KEY_AQUI";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// ======================
// INIT
// ======================

window.onload = function () {
    checkAdmin();
    loadGallery();
};

// ======================
// ADMIN
// ======================

window.checkAdmin = function () {

    const url = new URL(window.location.href);
    const isAdmin = url.searchParams.get("admin");

    if (isAdmin !== "true") return;

    const user = prompt("Login:");
    const pass = prompt("Senha:");

    if (user === "admin" && pass === "admin") {

        document.getElementById("clearBtn").style.display = "block";
        document.getElementById("downloadBtn").style.display = "block";
        document.getElementById("gallery").style.display = "grid";

    } else {
        alert("Acesso negado");
    }
};

// ======================
// UPLOAD
// ======================

window.uploadImage = async function () {

    const input = document.getElementById("file");

    if (!input.files.length) {
        alert("Selecione uma foto");
        return;
    }

    const file = input.files[0];

    document.getElementById("msg").innerText = "Enviando foto...";

    try {

        const fileName = `${Date.now()}-${file.name}`;

        // UPLOAD NO STORAGE
        const { error: uploadError } = await supabase
            .storage
            .from("photos")
            .upload(fileName, file);

        if (uploadError) {
            console.log(uploadError);
            document.getElementById("msg").innerText = "Erro no upload";
            return;
        }

        // PEGAR URL PÚBLICA
        const { data: urlData } = supabase
            .storage
            .from("photos")
            .getPublicUrl(fileName);

        const imageUrl = urlData.publicUrl;

        // SALVAR NO BANCO
        await supabase
            .from("photos")
            .insert([{ url: imageUrl }]);

        // MOSTRAR NA GALERIA
        addToGallery(imageUrl);

        document.getElementById("msg").innerText =
            "💖 Foto enviada com sucesso!";

    } catch (error) {
        console.log(error);
        document.getElementById("msg").innerText =
            "Erro: " + error.message;
    }
};

// ======================
// CARREGAR GALERIA
// ======================

window.loadGallery = async function () {

    const gallery = document.getElementById("gallery");

    gallery.innerHTML = "";

    const { data, error } = await supabase
        .from("photos")
        .select("*");

    if (error) {
        console.log(error);
        return;
    }

    data.forEach(photo => {
        addToGallery(photo.url);
    });
};

// ======================
// MOSTRAR FOTO
// ======================

function addToGallery(url) {

    const gallery = document.getElementById("gallery");

    const img = document.createElement("img");

    img.src = url;

    gallery.appendChild(img);
}

// ======================
// LIMPAR GALERIA (ADMIN)
// ======================

window.clearGallery = async function () {

    await supabase
        .from("photos")
        .delete()
        .neq("id", 0);

    document.getElementById("gallery").innerHTML = "";

    document.getElementById("msg").innerText =
        "Galeria limpa!";
};

// ======================
// DOWNLOAD URLS
// ======================

window.downloadAll = async function () {

    const { data, error } = await supabase
        .from("photos")
        .select("*");

    if (error || !data.length) {
        alert("Nenhuma foto encontrada");
        return;
    }

    const urls = data.map(photo => photo.url);
    const content = urls.join("\n");

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

    alert("Download iniciado!");
}
