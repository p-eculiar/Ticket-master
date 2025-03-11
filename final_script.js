document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("save-btn");
  const popupForm = document.getElementById("popup-form");
  let currentCard = null;

  // Open popup form
  document.querySelectorAll(".edit-icon").forEach((icon) => {
    icon.addEventListener("click", (e) => {
      currentCard = e.target.closest(".card");

      // Pre-fill countdown fields
      const countdownElement = currentCard.querySelector(".countdown .timer");
      const spans = countdownElement.querySelectorAll("span");
      document.getElementById("countdown-days").value = spans[0].textContent;
      document.getElementById("countdown-hours").value = spans[1].textContent;
      document.getElementById("countdown-minutes").value = spans[2].textContent;
      document.getElementById("countdown-seconds").value = spans[3].textContent;

      popupForm.style.display = "flex";
    });
  });

  // Save changes
  saveBtn.addEventListener("click", (event) => {
    event.preventDefault();

    // Update countdown
    const days = parseInt(document.getElementById("countdown-days").value, 10) || 0;
    const hours = parseInt(document.getElementById("countdown-hours").value, 10) || 0;
    const minutes = parseInt(document.getElementById("countdown-minutes").value, 10) || 0;
    const seconds = parseInt(document.getElementById("countdown-seconds").value, 10) || 0;

    const countdownElement = currentCard.querySelector(".timer");
    countdownElement.innerHTML = `
      <div><span>${days}</span><h3>DAY</h3></div>
      <div><span>${hours}</span><h3>HOUR</h3></div>
      <div><span>${minutes}</span><h3>MIN</h3></div>
      <div><span>${seconds}</span><h3>SEC</h3></div>
    `;

    // Update image
    const eventImage = document.getElementById("event-image").files[0];
    if (eventImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        currentCard.querySelector(".gradient-overlay img").src = e.target.result;
        localStorage.setItem("eventImage", e.target.result);
      };
      reader.readAsDataURL(eventImage);
    }

    popupForm.style.display = "none";
  });

  // Load saved image on page load
  const savedImage = localStorage.getItem("eventImage");
  if (savedImage) {
    document.querySelector(".gradient-overlay img").src = savedImage;
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const helpButton = document.getElementById("help-btn");
  const editIcons = document.querySelectorAll(".edit-icon");
  const popupForm = document.getElementById("popup-form");
  const closeBtn = document.getElementById("close-btn");
  const saveBtn = document.getElementById("save-btn");
  let currentCard = null;

  // Toggle edit icons
  helpButton.addEventListener("click", () => {
    editIcons.forEach(icon => {
      icon.style.display = icon.style.display === "none" ? "block" : "none";
    });
  });

  // Open popup form
  editIcons.forEach(icon => {
    icon.addEventListener("click", (event) => {
      currentCard = event.target.closest(".card");
      const celebrityName = currentCard.querySelector(".overlay-content h2").textContent;
      const eventName = currentCard.querySelector(".overlay-content p").textContent;
      const eventTime = currentCard.getAttribute("data-event-time");
      const seats = Array.from(currentCard.querySelectorAll(".seat-info div span")).map(span => span.textContent).join(", ");
      const countdown = currentCard.querySelectorAll(".timer span");
      const [days, hours, minutes, seconds] = Array.from(countdown).map(item => parseInt(item.textContent, 10));

      document.getElementById("celebrity-name").value = celebrityName;
      document.getElementById("event-name").value = eventName;
      document.getElementById("event-time").value = eventTime;
      document.getElementById("seats-info").value = seats;
      document.getElementById("countdown-days").value = days;
      document.getElementById("countdown-hours").value = hours;
      document.getElementById("countdown-minutes").value = minutes;
      document.getElementById("countdown-seconds").value = seconds;

      popupForm.style.display = "flex";
    });
  });

  // Close popup form
  closeBtn.addEventListener("click", () => {
    popupForm.style.display = "none";
  });

  
    // Save changes
    const eventImageInput = document.getElementById("event-image");

    saveBtn.addEventListener("click", (event) => {
        event.preventDefault();

        if (currentCard) {
            const newCelebrityName = document.getElementById("celebrity-name").value;
            const newEventName = document.getElementById("event-name").value;
            const newEventTime = document.getElementById("event-time").value;
            const newSeats = document.getElementById("seats-info").value.split(", ");
            const newDays = parseInt(document.getElementById("countdown-days").value, 10);
            const newHours = parseInt(document.getElementById("countdown-hours").value, 10);
            const newMinutes = parseInt(document.getElementById("countdown-minutes").value, 10);
            const newSeconds = parseInt(document.getElementById("countdown-seconds").value, 10);

            currentCard.querySelector(".overlay-content h2").textContent = newCelebrityName;
            currentCard.querySelector(".overlay-content p").textContent = newEventName;
            currentCard.setAttribute("data-event-time", newEventTime);

            const seatSpans = currentCard.querySelectorAll(".seat-info div span");
            seatSpans.forEach((span, index) => {
                if (newSeats[index]) span.textContent = newSeats[index];
            });

            const countdownElement = currentCard.querySelector(".timer");
            const eventTime = new Date(newEventTime).getTime();

            countdownElement.innerHTML = `
                <div><span>${newDays}</span><h3>DAY</h3></div>
                <div><span>${newHours}</span><h3>HOUR</h3></div>
                <div><span>${newMinutes}</span><h3>MIN</h3></div>
                <div><span>${newSeconds}</span><h3>SEC</h3></div>
            `;

            // Reinitialize countdown
            const updateCountdown = () => {
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
                    clearInterval(interval);
                }
            };

            const interval = setInterval(updateCountdown, 1000);
            updateCountdown();

            // Handle image update
            const newImageFile = eventImageInput.files[0];
            if (newImageFile) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    currentCard.querySelector(".gradient-overlay img").src = e.target.result;
                };
                reader.readAsDataURL(newImageFile);
            }

            popupForm.style.display = "none";
        }
    });
    
  saveBtn.addEventListener("click", (event) => {
    event.preventDefault();

    if (currentCard) {
      const newCelebrityName = document.getElementById("celebrity-name").value;
      const newEventName = document.getElementById("event-name").value;
      const newEventTime = document.getElementById("event-time").value;
      const newSeats = document.getElementById("seats-info").value.split(", ");
      const newDays = parseInt(document.getElementById("countdown-days").value, 10);
      const newHours = parseInt(document.getElementById("countdown-hours").value, 10);
      const newMinutes = parseInt(document.getElementById("countdown-minutes").value, 10);
      const newSeconds = parseInt(document.getElementById("countdown-seconds").value, 10);

      currentCard.querySelector(".overlay-content h2").textContent = newCelebrityName;
      currentCard.querySelector(".overlay-content p").textContent = newEventName;
      currentCard.setAttribute("data-event-time", newEventTime);

      const seatSpans = currentCard.querySelectorAll(".seat-info div span");
      seatSpans.forEach((span, index) => {
        if (newSeats[index]) span.textContent = newSeats[index];
      });

      const countdownElement = currentCard.querySelector(".timer");
      countdownElement.innerHTML = `
        <div><span>${newDays}</span><h3>DAY</h3></div>
        <div><span>${newHours}</span><h3>HOUR</h3></div>
        <div><span>${newMinutes}</span><h3>MIN</h3></div>
        <div><span>${newSeconds}</span><h3>SEC</h3></div>
      `;

      popupForm.style.display = "none";
    }
  });
});


// Swiper Configuration
const swiper = new Swiper('.swiper-container', {
  slidesPerView: 1, // Display 4 cards at once
  spaceBetween: 10,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});

document.addEventListener("DOMContentLoaded", function() {
    // Get all event cards
    const eventCards = document.querySelectorAll('.swiper-slide.card');

    eventCards.forEach((card) => {
        const eventTime = new Date(card.getAttribute('data-event-time')).getTime();
        const countdownElement = card.querySelector('.countdown .timer');

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = eventTime - now;

            // Calculate time left
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Update the countdown display
            countdownElement.innerHTML = `
                <div><span>${days}</span><h3>DAY</h3></div>
                <div><span>${hours}</span><h3>HOUR</h3></div>
                <div><span>${minutes}</span><h3>MIN</h3></div>
                <div><span>${seconds}</span><h3>SEC</h3></div>
            `;

            // If the event has passed
            if (distance < 0) {
                countdownElement.innerHTML = "<div><span>Event Started</span><h3></h3></div>";
                clearInterval(interval); // Stop the countdown
            }
        };

        // Update countdown every second
        const interval = setInterval(updateCountdown, 1000);
        updateCountdown(); // Initialize countdown immediately
    });
});


// Data for seat numbers
const totalSeats = 2; // Total number of seats (3 per row, 2 rows)
const seatContainer = document.getElementById("seat-container");
const seatCountDisplay = document.getElementById("seat-count");
const seatCountDisplay2 = document.getElementById("seat-count2");
const transferBtn2 = document.getElementById('transfer-btn2');
let selectedSeats = 0;

// Create seat elements dynamically
for (let i = 1; i <= totalSeats; i++) {
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
    seatCountDisplay.textContent = `Selected Seats: ${selectedSeats}`;
    seatCountDisplay2.textContent = `${selectedSeats} ticket selected`;
    transferBtn2.textContent = `Transfer ${selectedSeats} to`;
  });
}

// Open overlay
const openButton = document.getElementById("open-overlay-btn");
const overlay = document.getElementById("overlay");

// Open the overlay when the button is clicked
openButton.addEventListener("click", () => {
  overlay.style.display = "flex";
});

// Close the overlay when clicked outside the seat selection box
overlay.addEventListener("click", (event) => {
  if (event.target === overlay) {
    overlay.style.display = "none";
  }
});

// Open overlay2 (User Selection)
const openButton2 = document.getElementById("open-overlay2-btn");
const overlay2 = document.getElementById("overlay2");
const back = document.getElementById('back');
const back2 = document.getElementById('back-btn');

// Open the overlay2 when the button is clicked
openButton2.addEventListener("click", () => {
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
const openButton3 = document.getElementById("open-overlay3-btn");
const overlay3 = document.getElementById("overlay3");

// Open the overlay3 when the button is clicked
openButton3.addEventListener("click", () => {
  overlay3.style.display = "flex";
  overlay2.style.display = "none" ;
});

// Close overlay3 when clicked outside the form box
overlay3.addEventListener("click", (event) => {
  if (event.target === overlay3) {
    overlay3.style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", function () {
    const popup = document.querySelector(".popup-main");
    const closeBtn = document.querySelector(".close");
    const backBtn = document.querySelector(".back-btn");
    const transferBtn = document.querySelector(".transfer-btn2");
    const noteField = document.getElementById("note");
    const charCount = document.getElementById("char-count");
    
    function updateCharCount() {
        const remaining = 160 - noteField.value.length;
        charCount.textContent = `${remaining} Characters left`;
    }
    
    noteField.addEventListener("input", updateCharCount);
    
    closeBtn.addEventListener("click", function () {
        popup.style.display = "none";
    });
    
    backBtn.addEventListener("click", function () {
        popup.style.display = "none";
    });
   
});
document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("save-btn");
  const popupForm = document.getElementById("popup-form");
  const deleteBtn = document.getElementById("delete-btn"); // Added delete button reference
  let currentCard = null;

  // Open popup form
  document.querySelectorAll(".edit-icon").forEach((icon) => {
    icon.addEventListener("click", (e) => {
      currentCard = e.target.closest(".card");

      // Pre-fill countdown fields
      const countdownElement = currentCard.querySelector(".countdown .timer");
      const spans = countdownElement.querySelectorAll("span");
      document.getElementById("countdown-days").value = spans[0].textContent;
      document.getElementById("countdown-hours").value = spans[1].textContent;
      document.getElementById("countdown-minutes").value = spans[2].textContent;
      document.getElementById("countdown-seconds").value = spans[3].textContent;

      popupForm.style.display = "flex";
    });
  });

  // Save changes
  saveBtn.addEventListener("click", (event) => {
    event.preventDefault();

    // Update countdown
    const days = parseInt(document.getElementById("countdown-days").value, 10) || 0;
    const hours = parseInt(document.getElementById("countdown-hours").value, 10) || 0;
    const minutes = parseInt(document.getElementById("countdown-minutes").value, 10) || 0;
    const seconds = parseInt(document.getElementById("countdown-seconds").value, 10) || 0;

    const countdownElement = currentCard.querySelector(".timer");
    countdownElement.innerHTML = `
      <div><span>${days}</span><h3>DAY</h3></div>
      <div><span>${hours}</span><h3>HOUR</h3></div>
      <div><span>${minutes}</span><h3>MIN</h3></div>
      <div><span>${seconds}</span><h3>SEC</h3></div>
    `;

    // Update image
    const eventImage = document.getElementById("event-image").files[0];
    if (eventImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        currentCard.querySelector(".gradient-overlay img").src = e.target.result;
      };
      reader.readAsDataURL(eventImage);
    }

    popupForm.style.display = "none";
  });

  // Delete event card
  deleteBtn.addEventListener("click", () => {
    if (currentCard) {
      currentCard.remove();
      popupForm.style.display = "none";
    }
  });
});

