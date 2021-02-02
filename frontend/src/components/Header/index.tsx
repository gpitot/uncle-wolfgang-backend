import React, { useEffect, useState } from "react";
import classnames from "classnames";
import { Link } from "react-router-dom";
import style from "./style.module.scss";
import User from "components/User";

const HEADER_OFFSET = 96;

const Header = () => {
  const [dropdownShown, setDropdownShown] = useState(false);
  const [scrolledHeader, setScrolledHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > HEADER_OFFSET && !scrolledHeader) {
        setScrolledHeader(true);
      } else if (window.pageYOffset <= HEADER_OFFSET && scrolledHeader) {
        setScrolledHeader(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolledHeader]);

  const toggleHeader = () => {
    setDropdownShown(!dropdownShown);
  };

  const scrolledStyle = scrolledHeader && style["header-scrolled"];
  return (
    <>
      <section className={classnames(style.header, scrolledStyle)}>
        <div className={style.inner}>
          <div className={style["item-container"]}>
            <Link to="/">
              <img src="/logo-black.png" alt="" />
            </Link>
          </div>
          <div className={style["items-container"]}>
            <div
              className={classnames(style.items, dropdownShown && style.open)}
            >
              <Link to="/social" onClick={toggleHeader}>
                SOCIAL
              </Link>
              <Link to="/competition" onClick={toggleHeader}>
                COMPETITION
              </Link>
              <Link to="/coaching" onClick={toggleHeader}>
                COACHING
              </Link>
              <Link to="/shop" onClick={toggleHeader}>
                SHOP
              </Link>
            </div>
          </div>
          <User />

          <div className={style["mobile-item-container"]}>
            <button
              onClick={toggleHeader}
              className={style["mobile-dropdown"]}
            ></button>
          </div>
        </div>
      </section>
      <section className={style["fake-header"]}></section>
    </>
  );
};

export default Header;
