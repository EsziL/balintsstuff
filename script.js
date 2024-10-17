document.querySelectorAll("button").forEach(btn => {
    const ref = btn.getAttribute("href");
    if (ref == null) return;
    btn.addEventListener("click", e => {
        e.preventDefault();
        window.location.href = btn.getAttribute("href"); 
    });
});