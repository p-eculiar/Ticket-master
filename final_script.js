document.addEventListener("DOMContentLoaded", () => {
  // Add loading class to body
  document.body.classList.add('loading');
  
  // Function to hide loading overlay
  function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.style.opacity = '0';
    
    // Remove the overlay after the transition completes
    setTimeout(() => {
      loadingOverlay.style.display = 'none';
      document.body.classList.remove('loading');
    }, 500);
  }
  
  // Check if all resources are loaded
  window.addEventListener('load', () => {
    // Add a small delay to ensure the animation is visible
    setTimeout(hideLoadingOverlay, 2000);
  });

  // Initialize Swiper first
  const swiper = new Swiper('.swiper-container', {
    slidesPerView: 1,
    spaceBetween: 10,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: false
    }
  });

  // Get all necessary DOM elements
  const saveBtn = document.getElementById("save-btn");
  const popupForm = document.getElementById("popup-form");
  const closeBtn = document.getElementById("close-btn");
  const helpBtn = document.getElementById("help-btn");
  const addBtn = document.getElementById("add-btn");
  const deleteBtn = document.getElementById("delete-btn");
  const editIcons = document.querySelectorAll(".edit-icon");
  const swiperWrapper = document.querySelector(".swiper-wrapper");
  const seatContainer = document.getElementById("seat-container");
  const seatCountDisplay = document.getElementById("seat-count");
  const seatCountDisplay2 = document.getElementById("seat-count2");
  const transferBtn2 = document.getElementById('transfer-btn2');
  const openOverlayBtn = document.getElementById("open-overlay-btn");
  const overlay = document.getElementById("overlay");
  const openOverlay2Btn = document.getElementById("open-overlay2-btn");
  const overlay2 = document.getElementById("overlay2");
  const back = document.getElementById('back');
  const back2 = document.getElementById('back-btn');
  const openOverlay3Btn = document.getElementById("open-overlay3-btn");
  const overlay3 = document.getElementById("overlay3");
  const noteField = document.getElementById("note");
  const charCount = document.getElementById("char-count");
  
  let currentCard = null;
  let selectedSeats = 0;

  // Function to initialize countdown for a single card
  function initializeCountdown(card) {
    const eventTime = new Date(card.getAttribute('data-event-time')).getTime();
    const countdownElement = card.querySelector('.countdown .timer');
    
    // Clear any existing interval for this card
    if (card.countdownInterval) {
      clearInterval(card.countdownInterval);
    }

    function updateCountdown() {
      const now = new Date().getTime();
      const distance = eventTime - now;

      if (distance >= 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `
          <div><span>${days}</span><h3>DAY</h3></div>
          <div><span>${hours}</span><h3>HOUR</h3></div>
          <div><span>${minutes}</span><h3>MIN</h3></div>
          <div><span>${seconds}</span><h3>SEC</h3></div>
        `;
      } else {
        countdownElement.innerHTML = "<div><span>Event Started</span></div>";
        clearInterval(card.countdownInterval);
      }
    }

    // Store the interval ID on the card element
    card.countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
  }

  // Function to initialize countdowns for all cards
  function initializeCountdowns() {
    const eventCards = document.querySelectorAll('.swiper-slide.card');
    eventCards.forEach(card => {
      initializeCountdown(card);
    });
  }

  // Function to update pagination
  function updatePagination() {
    const totalSlides = document.querySelectorAll('.swiper-slide').length;
    const pagination = document.querySelector('.swiper-pagination');
    
    // Clear existing pagination
    pagination.innerHTML = '';
    
    // Create new pagination bullets
    for (let i = 0; i < totalSlides; i++) {
      const bullet = document.createElement('span');
      bullet.className = 'swiper-pagination-bullet';
      if (i === swiper.activeIndex) {
        bullet.classList.add('swiper-pagination-bullet-active');
      }
      pagination.appendChild(bullet);
    }
    
    // Update Swiper pagination
    swiper.pagination.render();
    swiper.pagination.update();
  }

  // Function to create a new card
  function createNewCard() {
    const cardTemplate = document.querySelector('.swiper-slide').cloneNode(true);
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 30); // Set event date to 30 days from now
    
    cardTemplate.setAttribute('data-event-time', currentDate.toISOString());
    cardTemplate.querySelector('.overlay-content h2').textContent = 'New Event';
    cardTemplate.querySelector('.overlay-content p').textContent = 'Event details here';
    
    // Initialize countdown for the new card
    initializeCountdown(cardTemplate);
    
    return cardTemplate;
  }

  // Function to handle edit icon click
  function handleEditClick(event) {
    currentCard = event.target.closest(".card");
    const celebrityName = currentCard.querySelector(".overlay-content h2").textContent;
    const eventName = currentCard.querySelector(".overlay-content p").textContent;
    const eventTime = currentCard.getAttribute("data-event-time");
    
    // Parse the event time to get current countdown values
    const eventDate = new Date(eventTime);
    const now = new Date();
    const timeDiff = eventDate - now;
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    // Pre-fill the form fields
    document.getElementById("celebrity-name").value = celebrityName;
    document.getElementById("event-name").value = eventName;
    document.getElementById("event-time").value = eventTime;
    document.getElementById("countdown-days").value = days;
    document.getElementById("countdown-hours").value = hours;
    document.getElementById("countdown-minutes").value = minutes;
    document.getElementById("countdown-seconds").value = seconds;

    popupForm.style.display = "flex";
  }

  // Open popup form
  document.querySelectorAll(".edit-icon").forEach((icon) => {
    icon.addEventListener("click", handleEditClick);
  });

  // Close popup form
  closeBtn.addEventListener("click", () => {
    popupForm.style.display = "none";
  });

  // Toggle edit mode
  helpBtn.addEventListener("click", () => {
    const isEditMode = editIcons[0].style.display === "block";
    editIcons.forEach(icon => {
      icon.style.display = isEditMode ? "none" : "block";
    });
    addBtn.style.display = isEditMode ? "none" : "block";
  });

  // Add new card
  addBtn.addEventListener("click", () => {
    const totalCards = document.querySelectorAll('.swiper-slide').length;
    if (totalCards < 6) {
      const newCard = createNewCard();
      swiperWrapper.appendChild(newCard);
      
      // Update Swiper and pagination
      swiper.update();
      updatePagination();
      updateSeatGeneration();
      
      // Add event listeners to new card
      const newEditIcon = newCard.querySelector('.edit-icon');
      newEditIcon.addEventListener('click', handleEditClick);
    } else {
      alert('Maximum number of cards (6) reached!');
    }
  });

  // Function to update seat generation based on number of cards
  function updateSeatGeneration() {
    if (!seatContainer) return;
    
    // Get the current number of event cards
    const totalCards = document.querySelectorAll('.swiper-slide').length;
    console.log("Total cards:", totalCards); // Debug log
    
    // Clear existing seats
    seatContainer.innerHTML = '';
    selectedSeats = 0;
    if (seatCountDisplay) seatCountDisplay.textContent = `Selected Seats: ${selectedSeats}`;
    if (seatCountDisplay2) seatCountDisplay2.textContent = `${selectedSeats} ticket selected`;
    if (transferBtn2) transferBtn2.textContent = `Transfer ${selectedSeats} to`;

    // Create seat elements dynamically - one seat per card
    for (let i = 1; i <= totalCards; i++) {
      const seat = document.createElement("div");
      seat.classList.add("seat");

      const seatTop = document.createElement("div");
      seatTop.classList.add("seat-top");
      seatTop.textContent = `Seat ${i}`;

      const seatCheckbox = document.createElement("div");
      seatCheckbox.classList.add("seat-checkbox");
      seatCheckbox.setAttribute("data-seat", i);

      // Seat number display
      const seatNumber = document.createElement("div");
      seatNumber.classList.add("seat-number");
      seatNumber.textContent = `Seat ${i}`;

      // Add the elements to the seat container
      seat.appendChild(seatTop);
      seat.appendChild(seatCheckbox);
      seatContainer.appendChild(seat);

      // Toggle selection on click
      seatCheckbox.addEventListener("click", () => {
        if (seatCheckbox.classList.contains("selected")) {
          seatCheckbox.classList.remove("selected");
          selectedSeats--;
        } else {
          seatCheckbox.classList.add("selected");
          selectedSeats++;
        }
        if (seatCountDisplay) seatCountDisplay.textContent = `Selected Seats: ${selectedSeats}`;
        if (seatCountDisplay2) seatCountDisplay2.textContent = `${selectedSeats} ticket selected`;
        if (transferBtn2) transferBtn2.textContent = `Transfer ${selectedSeats} to`;
      });
    }
  }

  // Save changes - FIXED VERSION
  saveBtn.onclick = function() {
    console.log("Save button clicked");
    
    if (!currentCard) {
      console.log("No current card selected");
      return;
    }
    
    // Get the new countdown values
    const days = parseInt(document.getElementById("countdown-days").value, 10) || 0;
    const hours = parseInt(document.getElementById("countdown-hours").value, 10) || 0;
    const minutes = parseInt(document.getElementById("countdown-minutes").value, 10) || 0;
    const seconds = parseInt(document.getElementById("countdown-seconds").value, 10) || 0;
    
    console.log("Countdown values:", days, hours, minutes, seconds);
    
    // Calculate new event time based on countdown values
    const now = new Date();
    const newEventTime = new Date(now);
    newEventTime.setDate(now.getDate() + days);
    newEventTime.setHours(now.getHours() + hours);
    newEventTime.setMinutes(now.getMinutes() + minutes);
    newEventTime.setSeconds(now.getSeconds() + seconds);
    
    console.log("New event time:", newEventTime.toISOString());
    
    // Update the card's event time
    currentCard.setAttribute("data-event-time", newEventTime.toISOString());
    
    // Update other card details
    const newCelebrityName = document.getElementById("celebrity-name").value;
    const newEventName = document.getElementById("event-name").value;
    
    currentCard.querySelector(".overlay-content h2").textContent = newCelebrityName;
    currentCard.querySelector(".overlay-content p").textContent = newEventName;
    
    // Update the countdown display immediately
    const countdownElement = currentCard.querySelector('.countdown .timer');
    countdownElement.innerHTML = `
      <div><span>${days}</span><h3>DAY</h3></div>
      <div><span>${hours}</span><h3>HOUR</h3></div>
      <div><span>${minutes}</span><h3>MIN</h3></div>
      <div><span>${seconds}</span><h3>SEC</h3></div>
    `;
    
    // Clear any existing interval for this card
    if (currentCard.countdownInterval) {
      clearInterval(currentCard.countdownInterval);
    }
    
    // Set up a new interval for this card
    currentCard.countdownInterval = setInterval(() => {
      const eventTime = new Date(currentCard.getAttribute('data-event-time')).getTime();
      const now = new Date().getTime();
      const distance = eventTime - now;
      
      if (distance >= 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        countdownElement.innerHTML = `
          <div><span>${days}</span><h3>DAY</h3></div>
          <div><span>${hours}</span><h3>HOUR</h3></div>
          <div><span>${minutes}</span><h3>MIN</h3></div>
          <div><span>${seconds}</span><h3>SEC</h3></div>
        `;
      } else {
        countdownElement.innerHTML = "<div><span>Event Started</span></div>";
        clearInterval(currentCard.countdownInterval);
      }
    }, 1000);
    
    // Handle image update if needed
    const eventImage = document.getElementById("event-image").files[0];
    if (eventImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        currentCard.querySelector(".gradient-overlay img").src = e.target.result;
      };
      reader.readAsDataURL(eventImage);
    }
    
    // Close the popup
    popupForm.style.display = "none";
    console.log("Popup closed");
  };

  // Also prevent form submission
  document.getElementById("edit-form").addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("Form submission prevented");
  });

  // Delete card functionality
  deleteBtn.addEventListener("click", () => {
    if (currentCard) {
      const totalCards = document.querySelectorAll('.swiper-slide').length;
      if (totalCards > 1) {
        currentCard.remove();
        swiper.update();
        updatePagination();
        updateSeatGeneration();
        popupForm.style.display = "none";
      } else {
        alert('Cannot delete the last card! Minimum 1 card required.');
      }
    }
  });

  // Open overlay
  openOverlayBtn.addEventListener("click", () => {
    overlay.style.display = "flex";
  });

  // Close the overlay when clicked outside the seat selection box
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      overlay.style.display = "none";
    }
  });

  // Open overlay2 (User Selection)
  openOverlay2Btn.addEventListener("click", () => {
    overlay2.style.display = "flex";
    overlay.style.display = "none";
  });

  back.addEventListener("click", () => {
    overlay.style.display = "flex";
    overlay2.style.display = "none";
  });

  back2.addEventListener("click", () => {
    overlay2.style.display = "flex";
    overlay3.style.display = "none";
  });

  // Close overlay2 when clicked outside the user selection box
  overlay2.addEventListener("click", (event) => {
    if (event.target === overlay2) {
      overlay2.style.display = "none";
    }
  });

  // Open overlay3 (Form Overlay)
  openOverlay3Btn.addEventListener("click", () => {
    overlay3.style.display = "flex";
    overlay2.style.display = "none" ;
  });

  // Close overlay3 when clicked outside the form box
  overlay3.addEventListener("click", (event) => {
    if (event.target === overlay3) {
      overlay3.style.display = "none";
    }
  });

  // Character count for note field
  function updateCharCount() {
    const remaining = 160 - noteField.value.length;
    charCount.textContent = `${remaining} Characters left`;
  }
  
  noteField.addEventListener("input", updateCharCount);

  // Initialize everything
  initializeCountdowns();
  updatePagination();
  updateSeatGeneration();
});