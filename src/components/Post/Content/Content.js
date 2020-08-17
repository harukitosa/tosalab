// @flow strict
import React from 'react';
import styles from './Content.module.scss';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'react-share';
type Props = {
  body: string,
  title: string
};

const Content = ({ body, title }: Props) => (
  <div className={styles['content']}>
    <h1 className={styles['content__title']}>{title}</h1>
    <div className={styles['content__body']} dangerouslySetInnerHTML={{ __html: body }} />
    <div className={styles['share']}> 
      <FacebookShareButton url={location.href} className={styles["mr-2"]}>
          <FacebookIcon size={40} round />
      </FacebookShareButton>
      <TwitterShareButton url={location.href} className={styles["mr-2"]}>
          <TwitterIcon size={40} round />
      </TwitterShareButton>
    </div>
  </div>
);

export default Content;
