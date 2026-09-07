document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-contacto');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Mensaje enviado de forma exitosa al centro de operaciones.');
            form.reset();
        });
    }
});