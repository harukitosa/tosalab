// @flow strict
import React from "react";
import Helmet from "react-helmet";
import type { Node as ReactNode } from "react";
import styles from "./Layout.module.scss";

type Props = {
  children: ReactNode,
  title: string,
  description?: string,
};

const Layout = ({
  children, title, description
}: Props) => {
  const metaImageUrl = `https://res.cloudinary.com/dam6j1bfo/image/upload/l_text:Sawarabi%20Gothic_120_bold:${
    title
  },co_rgb:333,w_1100,c_fit/v1600749907/hogeogp.001_zm7m59.jpg`;
  return (
    <div className={styles.layout}>
      <Helmet>
        <html lang="ja" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:site_name" content={title} />
        <meta property="og:image" content={metaImageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={metaImageUrl} />
      </Helmet>
      {children}
    </div>
  );
};

export default Layout;
