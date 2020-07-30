import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";

const isExternal = (path) => path.startsWith("http");

const Menu = (props) => {
  const { data } = props;

  const router = useRouter();

  const menuBlock = (
    <ul className="menu__list">
      {data.map((item) => {
        let link;
        if (isExternal(item.path)) {
          link = (
            <a
              className="menu__list-item-link"
              rel="noopener noreferrer"
              target="_blank"
              href={item.path}
            >
              {item.label}
            </a>
          );
        } else {
          link = (
            <Link href={item.path}>
              <a
                className={clsx(
                  "menu__list-item-link",
                  router.asPath === item.path
                    ? "menu__list-item-link--active"
                    : false
                )}
              >
                {item.label}
              </a>
            </Link>
          );
        }
        return (
          <li className="menu__list-item" key={item.path}>
            {link}
          </li>
        );
      })}
    </ul>
  );

  return <nav className="menu">{menuBlock}</nav>;
};

export default Menu;
