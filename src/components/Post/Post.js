// @flow strict
import React from 'react';
import { Link } from 'gatsby';
import Author from './Author';
import Comments from './Comments';
import Content from './Content';
import Meta from './Meta';
import Tags from './Tags';
import styles from './Post.module.scss';
import type { Node } from '../../types';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'react-share';
type Props = {
  post: Node,
  url: string,
};

const Post = ({ post, url }: Props) => {
  const { html } = post;
  const { tagSlugs, slug } = post.fields;
  const { tags, title, date } = post.frontmatter;

  return (
    <div className={styles['post']}>
      <Link className={styles['post__home-button']} to="/">All Articles</Link>

      <div className={styles['post__content']}>
        <Content body={html} title={title} />
      </div>


      <div className={styles['post__footer']}>
        <div> 
          <FacebookShareButton url={url}>
              <FacebookIcon size={40} round />
          </FacebookShareButton>
          <TwitterShareButton url={url}>
              <TwitterIcon size={40} round />
          </TwitterShareButton>
        </div>
        <Meta date={date} />
        {tags && tagSlugs && <Tags tags={tags} tagSlugs={tagSlugs} />}
        <Author />
      </div>

      <div className={styles['post__comments']}>
        <Comments postSlug={slug} postTitle={post.frontmatter.title} />
      </div>
    </div>
  );
};

export default Post;
