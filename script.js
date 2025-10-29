// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle functionality
  const themeSwitch = document.getElementById("theme-switch")

  // Check for saved theme preference or use preferred color scheme
  const savedTheme = localStorage.getItem("theme")
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.body.classList.add("dark-theme")
    themeSwitch.checked = true
  }

  // Theme switch event listener
  themeSwitch.addEventListener("change", function () {
    if (this.checked) {
      document.body.classList.add("dark-theme")
      localStorage.setItem("theme", "dark")
    } else {
      document.body.classList.remove("dark-theme")
      localStorage.setItem("theme", "light")
    }
  })

  // Header scroll effect
  const header = document.querySelector("header")
  const scrollTop = document.querySelector(".scroll-top")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      header.classList.add("sticky")
      scrollTop.classList.add("active")
    } else {
      header.classList.remove("sticky")
      scrollTop.classList.remove("active")
    }
  })

  // Scroll to top button
  scrollTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  // Mobile menu toggle
  const navToggle = document.getElementById("navToggle")
  const navMenu = document.querySelector(".nav-menu")

  // Create menu overlay
  const menuOverlay = document.createElement("div")
  menuOverlay.className = "menu-overlay"
  document.body.appendChild(menuOverlay)

  // Function to open menu
  function openMenu() {
    navMenu.classList.add("active")
    menuOverlay.classList.add("active")
    document.body.style.overflow = "hidden"

    // Animate hamburger icon
    const spans = navToggle.querySelectorAll("span")
    spans[0].style.transform = "rotate(45deg) translate(6px, 6px)"
    spans[1].style.opacity = "0"
    spans[2].style.transform = "rotate(-45deg) translate(6px, -6px)"
  }

  // Function to close menu
  function closeMenu() {
    navMenu.classList.remove("active")
    menuOverlay.classList.remove("active")
    document.body.style.overflow = ""

    // Reset hamburger icon
    const spans = navToggle.querySelectorAll("span")
    spans[0].style.transform = "none"
    spans[1].style.opacity = "1"
    spans[2].style.transform = "none"
  }

  // Toggle menu
  navToggle.addEventListener("click", () => {
    if (navMenu.classList.contains("active")) {
      closeMenu()
    } else {
      openMenu()
    }
  })

  // Close menu when clicking on overlay
  menuOverlay.addEventListener("click", closeMenu)

  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu)
  })

  // About tabs functionality
  const tabBtns = document.querySelectorAll(".tab-btn")
  const tabPanes = document.querySelectorAll(".tab-pane")

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons and panes
      tabBtns.forEach((btn) => btn.classList.remove("active"))
      tabPanes.forEach((pane) => pane.classList.remove("active"))

      // Add active class to clicked button
      this.classList.add("active")

      // Show corresponding tab pane
      const tabId = this.getAttribute("data-tab")
      document.getElementById(tabId).classList.add("active")
    })
  })

  // Services slider functionality - modified to show 3 cards with blur effect
  const servicesContainer = document.querySelector(".services-container")
  const prevBtn = document.querySelector(".prev-btn")
  const nextBtn = document.querySelector(".next-btn")
  const dots = document.querySelectorAll(".dot")
  const serviceCards = document.querySelectorAll(".service-card")

  let currentIndex = 0
  const totalCards = serviceCards.length
  let cardsPerView = 3 // Default for desktop
  let maxIndex // Declare maxIndex here

  // Function to determine how many cards should be visible based on screen width
  function updateCardsPerView() {
    if (window.innerWidth < 768) {
      cardsPerView = 1
    } else if (window.innerWidth < 1024) {
      cardsPerView = 2
    } else {
      cardsPerView = 3
    }

    // Update max index based on cards per view
    maxIndex = totalCards - cardsPerView

    // Make sure current index is valid
    if (currentIndex > maxIndex) {
      currentIndex = maxIndex
    }

    updateSlider()
  }

  // Function to update which cards are blurred
  function updateCardBlur() {
    serviceCards.forEach((card, index) => {
      // If the card is within the current view range, don't blur it
      if (index >= currentIndex && index < currentIndex + cardsPerView) {
        card.classList.remove("blurred")
      } else {
        card.classList.add("blurred")
      }
    })
  }

  // Initialize slider
  updateCardsPerView()
  updateCardBlur()

  // Previous button click
  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--
      updateSlider()
      updateCardBlur()
    }
  })

  // Next button click
  nextBtn.addEventListener("click", () => {
    if (currentIndex < totalCards - cardsPerView) {
      currentIndex++
      updateSlider()
      updateCardBlur()
    }
  })

  // Dot click
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      // Calculate appropriate index based on dot position
      const dotCount = dots.length
      const segmentSize = totalCards / dotCount
      currentIndex = Math.min(Math.floor(index * segmentSize), totalCards - cardsPerView)
      updateSlider()
      updateCardBlur()
    })
  })

  // Update slider position and active dot
  function updateSlider() {
    const cardWidth = serviceCards[0].offsetWidth
    const cardMargin = 30 // Gap between cards
    const offset = currentIndex * (cardWidth + cardMargin)
    servicesContainer.style.transform = `translateX(-${offset}px)`

    // Update dots
    const dotCount = dots.length
    const segmentSize = totalCards / dotCount

    dots.forEach((dot, index) => {
      const dotSegmentStart = Math.floor(index * segmentSize)
      const dotSegmentEnd = Math.floor((index + 1) * segmentSize) - 1

      if (currentIndex >= dotSegmentStart && currentIndex <= dotSegmentEnd) {
        dot.classList.add("active")
      } else {
        dot.classList.remove("active")
      }
    })

    // Update button states
    prevBtn.style.opacity = currentIndex === 0 ? "0.5" : "1"
    nextBtn.style.opacity = currentIndex >= totalCards - cardsPerView ? "0.5" : "1"
  }

  // Handle window resize
  window.addEventListener("resize", () => {
    updateCardsPerView()
    updateCardBlur()
  })

  // Project filtering
  const filterBtns = document.querySelectorAll(".filter-btn")
  const workItems = document.querySelectorAll(".work-item")

  // Show all work items by default
  workItems.forEach((item) => {
    item.style.display = "block"
    item.style.opacity = "1"
    item.style.transform = "scale(1)"
  })

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      filterBtns.forEach((btn) => btn.classList.remove("active"))

      // Add active class to clicked button
      this.classList.add("active")

      const filter = this.getAttribute("data-filter")

      workItems.forEach((item) => {
        if (filter === "all") {
          item.style.display = "block"
          setTimeout(() => {
            item.style.opacity = "1"
            item.style.transform = "scale(1)"
          }, 100)
        } else if (item.getAttribute("data-category") === filter) {
          item.style.display = "block"
          setTimeout(() => {
            item.style.opacity = "1"
            item.style.transform = "scale(1)"
          }, 100)
        } else {
          item.style.opacity = "0"
          item.style.transform = "scale(0.8)"
          setTimeout(() => {
            item.style.display = "none"
          }, 300)
        }
      })
    })
  })

  // --- Global Contact Options Modal Logic ---
  const globalContactOptionsModal = document.getElementById("globalContactOptionsModal")
  const modalEmailBtn = document.getElementById("modalEmailBtn")
  const modalWhatsappBtn = document.getElementById("modalWhatsappBtn")
  const modalCancelBtn = document.getElementById("modalCancelBtn")
  const formStatus = document.getElementById("formStatus")

  let isFormSubmission = false // Flag to check if the modal was opened by form submission

  function showContactOptionsModal(fromForm = false) {
    isFormSubmission = fromForm
    globalContactOptionsModal.classList.add("active")
    document.body.style.overflow = "hidden" // Prevent scrolling when modal is active
  }

  function hideContactOptionsModal() {
    globalContactOptionsModal.classList.remove("active")
    document.body.style.overflow = "" // Restore scrolling
    if (isFormSubmission) {
      // Only reset form if it was a form submission
      contactForm.reset()
      formStatus.textContent = ""
      formStatus.classList.remove("success")
      contactForm.querySelector(".submit-btn").style.display = "flex"
    }
  }

  // Event listener for the "Let's Connect" button
  const connectBtn = document.getElementById("connectBtn")
  if (connectBtn) {
    connectBtn.addEventListener("click", () => {
      showContactOptionsModal(false) // Not from form submission
    })
  }

  // Event listener for the contact form submission
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      const formStatus = document.getElementById("formStatus");
      formStatus.textContent = "Sending message...";
      formStatus.classList.add("success");
    })
  }

  // Event listeners for buttons inside the modal
  if (modalEmailBtn) {
    modalEmailBtn.addEventListener("click", () => {
      const emailSubject = isFormSubmission
        ? encodeURIComponent(`Portfolio Contact: ${document.getElementById("subject").value}`)
        : encodeURIComponent("Portfolio Connection Request")
      const emailBody = isFormSubmission
        ? encodeURIComponent(
            `Name: ${document.getElementById("name").value}\nEmail: ${document.getElementById("email").value}\n\nMessage:\n${document.getElementById("message").value}`,
          )
        : encodeURIComponent("Hi Devang, I'd like to connect with you regarding your portfolio.")

      window.open(`mailto:deokuledevang@gmail.com?subject=${emailSubject}&body=${emailBody}`, "_blank")

      formStatus.textContent = "Message sent via Email! Check your email client."
      formStatus.classList.add("success")
      setTimeout(hideContactOptionsModal, 3000)
    })
  }

  if (modalWhatsappBtn) {
    modalWhatsappBtn.addEventListener("click", () => {
      const whatsappMessage = isFormSubmission
        ? encodeURIComponent(
            `Hi Devang! I'm ${document.getElementById("name").value}.\n\nSubject: ${document.getElementById("subject").value}\n\nMessage: ${document.getElementById("message").value}\n\nYou can reach me at: ${document.getElementById("email").value}`,
          )
        : encodeURIComponent("Hi Devang! I saw your portfolio and would like to connect.")

      window.open(`https://wa.me/917039969768?text=${whatsappMessage}`, "_blank")

      formStatus.textContent = "Message sent via WhatsApp!"
      formStatus.classList.add("success")
      setTimeout(hideContactOptionsModal, 3000)
    })
  }

  if (modalCancelBtn) {
    modalCancelBtn.addEventListener("click", hideContactOptionsModal)
  }

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.2,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in")
      }
    })
  }, observerOptions)

  // Elements to observe
  const sections = document.querySelectorAll("section")

  sections.forEach((section) => {
    observer.observe(section)
  })

  // Add animation class to elements
  const animateElements = document.querySelectorAll(
    ".about-card, .service-card, .work-item, .contact-info, .contact-form, .skill-card",
  )

  animateElements.forEach((el) => {
    el.classList.add("animate-element")
  })

  // Initialize section animations
  initSectionAnimations()

  // Add this code at the end of the DOMContentLoaded event listener
  // to prevent image copying/downloading

  // Prevent right-click on images
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("contextmenu", (event) => {
      event.preventDefault()
    })
  })

  // Prevent dragging images
  document.querySelectorAll("img").forEach((img) => {
    img.setAttribute("draggable", "false")
  })

  // Add a warning when someone tries to copy content
  document.addEventListener("copy", (e) => {
    // You can customize or remove this if you don't want to show a warning
    // console.log('Content copying detected');
  })
})

// Add this function to create animated section titles
function initSectionAnimations() {
  // Create animated text for section headers
  const sectionHeaders = document.querySelectorAll(".section-header h2")

  sectionHeaders.forEach((header) => {
    const text = header.textContent
    let newHTML = ""

    // Wrap each letter in a span for animation
    for (let i = 0; i < text.length; i++) {
      if (text[i] === " ") {
        newHTML += " "
      } else {
        newHTML += `<span style="animation-delay: ${i * 0.05}s">${text[i]}</span>`
      }
    }

    header.innerHTML = newHTML
  })

  // Add animation class to section headers when they come into view
  const headerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-letters")
          headerObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.5 },
  )

  sectionHeaders.forEach((header) => {
    headerObserver.observe(header)
  })
}
