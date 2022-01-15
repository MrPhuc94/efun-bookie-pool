import ButtonUp from "src/assets/icons/ButtonUp";
import React, { useEffect } from "react";
import "./styles.scss";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  useEffect(() => {
    let scrollToTopBtn = document.getElementById("scrollToTopBtn");
    let rootElement = document.documentElement;
    function scrollToTop() {
      // Scroll to top logic
      rootElement.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    console.log("scrollToTopBtn", scrollToTopBtn);

    scrollToTopBtn.addEventListener("click", scrollToTop);

    const handleScroll = () => {
      console.log("111111111");
      // Do something on scroll
      let scrollTotal = rootElement.scrollHeight - rootElement.clientHeight;
      if (rootElement.scrollTop / scrollTotal > 0.8) {
        // Show button
        scrollToTopBtn.classList.add("showBtn");
      } else {
        // Hide button
        scrollToTopBtn.classList.remove("showBtn");
      }
    };

    window.addEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer className="footer-2">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <p className="copyright order-md-1 order-2">
            © 2021{" "}
            <a href="#" className="text-primary">
              EFUN.tech
            </a>{" "}
            All rights reserved.
          </p>
          <ul className="order-md-2 order-1">
            <li>
              <a href="#">{t("common.terms_of_service")}</a>
            </li>
            <li>
              <a href="#">{t("common.privacy_policy")}</a>
            </li>
          </ul>
        </div>
        <div>
          <span className="go-top" id="scrollToTopBtn">
            <ButtonUp />
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
