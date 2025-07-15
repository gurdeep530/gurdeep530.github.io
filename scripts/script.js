function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}
function openVideoModal(src) {
    // Create modal overlay
    const overlay = document.createElement("div");
    overlay.id = "videoModalOverlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "1000";
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 0.3s ease";

    // Create modal content
    const modal = document.createElement("div");
    modal.id = "videoModal";
    modal.style.backgroundColor = "#fff";
    modal.style.padding = "20px";
    modal.style.borderRadius = "10px";
    modal.style.maxWidth = "90%";
    modal.style.maxHeight = "90%";
    modal.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
    modal.style.position = "relative";
    modal.style.transform = "scale(0.8)";
    modal.style.transition = "transform 0.3s ease";

    // Create video element
    const video = document.createElement("video");
    video.src = src;
    video.controls = true;
    video.style.maxWidth = "80vw";
    video.style.maxHeight = "45vh";
    video.style.width = "100%";
    video.style.height = "auto";

    // Create close button
    const closeBtn = document.createElement("button");
    closeBtn.innerText = "Close";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "10px";
    closeBtn.style.right = "10px";
    closeBtn.style.padding = "8px 16px";
    closeBtn.style.backgroundColor = "#0089ce";
    closeBtn.style.color = "#fff";
    closeBtn.style.border = "none";
    closeBtn.style.borderRadius = "5px";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.fontSize = "16px";
    closeBtn.style.animation = "pulse 2s infinite ease-in-out";

    // Append elements
    modal.appendChild(video);
    modal.appendChild(closeBtn);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Trigger animations
    setTimeout(() => {
        overlay.style.opacity = "1";
        modal.style.transform = "scale(1)";
    }, 10);

    // Close modal on button click
    closeBtn.onclick = closeVideoModal;

    // Close modal on overlay click
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            closeVideoModal();
        }
    };
}

function closeVideoModal() {
    const overlay = document.getElementById("videoModalOverlay");
    const modal = document.getElementById("videoModal");
    if (overlay && modal) {
        overlay.style.opacity = "0";
        modal.style.transform = "scale(0.8)";
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}

// Trigger section animations on scroll
window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section");
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
            section.classList.add("visible");
        }
    });
});

// Trigger animations on page load
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section");
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            section.classList.add("visible");
        }
    });
});