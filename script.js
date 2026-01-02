// Mobile Navigation Toggle
const menuToggle = document.getElementById("menuToggle")
const closeNav = document.getElementById("closeNav")
const mobileNav = document.getElementById("mobileNav")
const mobileNavOverlay = document.getElementById("mobileNavOverlay")

function openMobileNav() {
  mobileNav.classList.add("active")
  mobileNavOverlay.classList.add("active")
  document.body.style.overflow = "hidden"
}

function closeMobileNav() {
  mobileNav.classList.remove("active")
  mobileNavOverlay.classList.remove("active")
  document.body.style.overflow = ""
}

menuToggle.addEventListener("click", openMobileNav)
closeNav.addEventListener("click", closeMobileNav)
mobileNavOverlay.addEventListener("click", closeMobileNav)

// Close mobile nav when clicking on a category link
const navCategoryLinks = document.querySelectorAll(".nav-category")
navCategoryLinks.forEach((link) => {
  link.addEventListener("click", closeMobileNav)
})

// Smooth scroll for category links
const categoryLinks = document.querySelectorAll(".category-link, .nav-category")
categoryLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault()
    const targetId = link.getAttribute("href")
    const targetSection = document.querySelector(targetId)

    if (targetSection) {
      const headerOffset = 150
      const elementPosition = targetSection.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  })
})

// Highlight active category in navigation
const categoryNavLinks = document.querySelectorAll(".category-link")
const sections = document.querySelectorAll(".menu-section")

function highlightActiveCategory() {
  let currentSection = ""

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 200
    const sectionHeight = section.clientHeight

    if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
      currentSection = section.getAttribute("id")
    }
  })

  categoryNavLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active")
    }
  })
}

window.addEventListener("scroll", highlightActiveCategory)

// Add active class style dynamically
const style = document.createElement("style")
style.textContent = `
    .category-link.active {
        background-color: var(--primary);
        color: white;
    }
`
document.head.appendChild(style)
