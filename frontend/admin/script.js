document.addEventListener("DOMContentLoaded", () => {
    const imageInput = document.getElementById("image");
    const preview = document.getElementById("image-preview");

    imageInput.addEventListener("change", () => {
        if (preview.classList.contains("active")) {
            preview.classList.toggle("active");
        }

        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                preview.src = reader.result;
            };

            preview.classList.toggle("active");
            reader.readAsDataURL(file);
        } else {
            preview.src = '';
        }
    });
});