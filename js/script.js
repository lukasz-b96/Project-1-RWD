const toggleScript = document.querySelector('.toggle')
const navigationScript = document.querySelector('.navigation')

toggleScript.addEventListener('click', () => {
    toggleScript.classList.toggle('active');
    navigationScript.classList.toggle('active');
})