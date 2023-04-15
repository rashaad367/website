document.addEventListener('DOMContentLoaded', () => {
    const closeButtons = document.querySelectorAll('.fa-x');

    closeButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            e.target.parentNode.style.display = 'none';
        });
    });
});