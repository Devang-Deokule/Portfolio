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

  // Form submission
  const contactForm = document.getElementById("contactForm")
  const formStatus = document.getElementById("formStatus")

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const subject = document.getElementById("subject").value
      const message = document.getElementById("message").value

      // Hide the submit button and show contact options
      const submitBtn = contactForm.querySelector(".submit-btn")
      submitBtn.style.display = "none"

      // Create contact options HTML
      const contactOptionsHTML = `
      <div class="contact-options" id="contactOptions">
        <p style="text-align: center; margin-bottom: 20px; color: var(--text-color); font-weight: 500;">Choose how to send your message:</p>
        <div class="contact-buttons">
          <button type="button" class="btn primary-btn contact-option-btn" id="emailBtn">
            <i class="fas fa-envelope"></i>
            Send via Email
          </button>
          <button type="button" class="btn secondary-btn contact-option-btn" id="whatsappBtn">
            <i class="fab fa-whatsapp"></i>
            Send via WhatsApp
          </button>
        </div>
        <button type="button" class="btn cancel-btn" id="cancelBtn">
          <i class="fas fa-times"></i>
          Cancel
        </button>
      </div>
    `

      // Insert contact options after the form
      submitBtn.insertAdjacentHTML("afterend", contactOptionsHTML)

      // Add event listeners to the new buttons
      const emailBtn = document.getElementById("emailBtn")
      const whatsappBtn = document.getElementById("whatsappBtn")
      const cancelBtn = document.getElementById("cancelBtn")
      const contactOptions = document.getElementById("contactOptions")

      // Email button click
      emailBtn.addEventListener("click", () => {
        const emailSubject = encodeURIComponent(`Portfolio Contact: ${subject}`)
        const emailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)

        window.open(`mailto:deokuledevang@gmail.com?subject=${emailSubject}&body=${emailBody}`, "_blank")

        showSuccessAndReset("Message sent via Email! Check your email client.")
      })

      // WhatsApp button click
      whatsappBtn.addEventListener("click", () => {
        const whatsappMessage = encodeURIComponent(
          `Hi Devang! I'm ${name}.\n\nSubject: ${subject}\n\nMessage: ${message}\n\nYou can reach me at: ${email}`,
        )

        window.open(`https://wa.me/917039969768?text=${whatsappMessage}`, "_blank")

        showSuccessAndReset("Message sent via WhatsApp!")
      })

      // Cancel button click
      cancelBtn.addEventListener("click", () => {
        contactOptions.remove()
        submitBtn.style.display = "flex"
      })

      // Function to show success message and reset form
      function showSuccessAndReset(message) {
        contactOptions.remove()

        formStatus.textContent = message
        formStatus.classList.add("success")

        setTimeout(() => {
          contactForm.reset()
          formStatus.textContent = ""
          formStatus.classList.remove("success")
          submitBtn.style.display = "flex"
        }, 3000)
      }
    })
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
