// =====================================================
// LEMAT RESTAURANT — WEBSITE JAVASCRIPT
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

  // ---------------------------------------------------
  // MOBILE NAVIGATION
  // ---------------------------------------------------

  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", () => {
      mainNav.classList.toggle("active");

      const expanded =
        mainNav.classList.contains("active");

      menuToggle.setAttribute(
        "aria-expanded",
        expanded
      );
    });

    // Close mobile menu after clicking a link
    mainNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("active");

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );
      });
    });
  }


  // ---------------------------------------------------
  // HEADER ON SCROLL
  // ---------------------------------------------------

  const header = document.querySelector(".site-header");

  function handleHeaderScroll() {

    if (!header) return;

    if (window.scrollY > 60) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener(
    "scroll",
    handleHeaderScroll,
    { passive: true }
  );

  handleHeaderScroll();


  // ---------------------------------------------------
  // SMOOTH SCROLL
  // ---------------------------------------------------

  document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

      const targetId =
        link.getAttribute("href");

      if (
        !targetId ||
        targetId === "#"
      ) {
        return;
      }

      const target =
        document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });

  });


  // ---------------------------------------------------
  // MENU FILTERING
  // ---------------------------------------------------

  const filterButtons =
    document.querySelectorAll(".filter-btn");

  const menuCards =
    document.querySelectorAll(".menu-card");

  if (
    filterButtons.length &&
    menuCards.length
  ) {

    filterButtons.forEach(button => {

      button.addEventListener("click", () => {

        // Active button
        filterButtons.forEach(btn => {
          btn.classList.remove("active");
        });

        button.classList.add("active");

        const filter =
          button.dataset.filter;

        menuCards.forEach(card => {

          const category =
            card.dataset.category;

          if (
            filter === "all" ||
            category === filter
          ) {

            card.classList.remove("hidden");

          } else {

            card.classList.add("hidden");

          }

        });

      });

    });

  }


  // ---------------------------------------------------
  // ORDER CART
  // ---------------------------------------------------

  const orderDrawer =
    document.querySelector(".order-drawer");

  const orderItems =
    document.querySelector(".order-items");

  const orderTotal =
    document.querySelector(".order-total strong");

  const orderCount =
    document.querySelector(".floating-order strong");

  const openOrderButton =
    document.querySelector(".floating-order");

  const closeOrderButton =
    document.querySelector(".order-header button");

  const orderButtons =
    document.querySelectorAll(".order-btn");


  let cart = [];


  // Open drawer
  if (openOrderButton && orderDrawer) {

    openOrderButton.addEventListener("click", () => {

      orderDrawer.classList.add("open");

      document.body.style.overflow = "hidden";

    });

  }


  // Close drawer
  if (closeOrderButton && orderDrawer) {

    closeOrderButton.addEventListener("click", () => {

      orderDrawer.classList.remove("open");

      document.body.style.overflow = "";

    });

  }


  // Add menu item
  orderButtons.forEach(button => {

    button.addEventListener("click", () => {

      const card =
        button.closest(".menu-card");

      if (!card) return;


      const nameElement =
        card.querySelector("h3");

      const priceElement =
        card.querySelector(".menu-price");


      if (!nameElement || !priceElement) {
        return;
      }


      const name =
        nameElement.textContent.trim();

      const priceText =
        priceElement.textContent.trim();


      const numericPrice =
        Number(
          priceText
            .replace(/[^\d.]/g, "")
        );


      const existing =
        cart.find(item =>
          item.name === name
        );


      if (existing) {

        existing.quantity += 1;

      } else {

        cart.push({
          name,
          price: numericPrice,
          priceText,
          quantity: 1
        });

      }


      renderCart();

      showToast(
        `${name} added to your order`
      );

    });

  });


  // Render cart
  function renderCart() {

    if (!orderItems) return;


    if (!cart.length) {

      orderItems.innerHTML = `
        <div class="empty-order">
          <span>✦</span>
          <p>Your order is empty</p>
          <small>Add something delicious from our menu.</small>
        </div>
      `;

    } else {

      orderItems.innerHTML = cart.map(
        (item, index) => {

          const itemTotal =
            item.price * item.quantity;

          return `
            <div class="order-row">

              <div>
                <h4>${escapeHTML(item.name)}</h4>

                <p>
                  ${item.quantity} ×
                  ${formatBirr(item.price)}
                </p>
              </div>

              <div>
                <strong>
                  ${formatBirr(itemTotal)}
                </strong>

                <button
                  class="order-remove"
                  data-index="${index}"
                  type="button"
                >
                  Remove
                </button>
              </div>

            </div>
          `;

        }
      ).join("");

    }


    // Total
    const total =
      cart.reduce(
        (sum, item) =>
          sum + item.price * item.quantity,
        0
      );


    const count =
      cart.reduce(
        (sum, item) =>
          sum + item.quantity,
        0
      );


    if (orderTotal) {

      orderTotal.textContent =
        formatBirr(total);

    }


    if (orderCount) {

      orderCount.textContent =
        count;

    }


    // Remove item
    document
      .querySelectorAll(".order-remove")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const index =
              Number(button.dataset.index);

            cart.splice(index, 1);

            renderCart();

          }
        );

      });

  }


  // ---------------------------------------------------
  // ETHIOPIAN BIRR FORMAT
  // ---------------------------------------------------

  function formatBirr(amount) {

    return (
      "ETB " +
      Number(amount).toLocaleString(
        "en-ET",
        {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }
      )
    );

  }


  // ---------------------------------------------------
  // HTML ESCAPE
  // ---------------------------------------------------

  function escapeHTML(value) {

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  // ---------------------------------------------------
  // RESERVATION FORM
  // ---------------------------------------------------

  const reservationForm =
    document.querySelector("#reservationForm");


  if (reservationForm) {

    reservationForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        const formData =
          new FormData(reservationForm);


        const name =
          formData.get("name") ||
          "Guest";


        const date =
          formData.get("date");


        const time =
          formData.get("time");


        const guests =
          formData.get("guests");


        if (!date || !time || !guests) {

          showToast(
            "Please complete your reservation details."
          );

          return;

        }


        showToast(
          `Thank you ${name}! Your reservation request has been received.`
        );


        reservationForm.reset();

      }
    );

  }


  // ---------------------------------------------------
  // ORDER CHECKOUT
  // ---------------------------------------------------

  const checkoutButton =
    document.querySelector(
      ".order-footer .btn"
    );


  if (checkoutButton) {

    checkoutButton.addEventListener(
      "click",
      () => {

        if (!cart.length) {

          showToast(
            "Your order is empty. Add an item first."
          );

          return;

        }


        const total =
          cart.reduce(
            (sum, item) =>
              sum +
              item.price *
              item.quantity,
            0
          );


        showToast(
          `Order total: ${formatBirr(total)}`
        );


        // ------------------------------------------------
        // IMPORTANT:
        // Connect this button to WhatsApp/backend/payment
        // when the real restaurant ordering system is ready.
        // ------------------------------------------------

      }
    );

  }


  // ---------------------------------------------------
  // TOAST NOTIFICATION
  // ---------------------------------------------------

  function showToast(message) {

    let toast =
      document.querySelector(".toast");


    if (!toast) {

      toast =
        document.createElement("div");

      toast.className = "toast";

      document.body.appendChild(toast);

    }


    toast.textContent = message;

    toast.classList.add("show");


    clearTimeout(
      toast.hideTimer
    );


    toast.hideTimer =
      setTimeout(() => {

        toast.classList.remove("show");

      }, 3000);

  }


  // ---------------------------------------------------
  // ESC KEY
  // ---------------------------------------------------

  document.addEventListener(
    "keydown",
    event => {

      if (event.key !== "Escape") {
        return;
      }


      if (orderDrawer) {

        orderDrawer.classList.remove(
          "open"
        );

        document.body.style.overflow = "";

      }


      if (mainNav) {

        mainNav.classList.remove(
          "active"
        );

      }

    }
  );


  // ---------------------------------------------------
  // IMAGE ERROR HANDLING
  // ---------------------------------------------------

  document
    .querySelectorAll("img")
    .forEach(img => {

      img.addEventListener(
        "error",
        () => {

          img.style.background =
            "#e9e4da";

          img.style.objectFit =
            "cover";

        }
      );

    });


  // ---------------------------------------------------
  // CURRENT YEAR
  // ---------------------------------------------------

  const yearElement =
    document.querySelector(
      "[data-current-year]"
    );


  if (yearElement) {

    yearElement.textContent =
      new Date().getFullYear();

  }


  // ---------------------------------------------------
  // INITIAL CART
  // ---------------------------------------------------

  renderCart();

});