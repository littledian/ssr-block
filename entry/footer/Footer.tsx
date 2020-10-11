import React from 'react';
import { Typography } from 'antd';
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <div className={styles.foot}>
      <Typography.Link className={styles.link} href="http://www.beian.miit.gov.cn/" target="_blank">
        浙ICP备19031225号
      </Typography.Link>
    </div>
  );
}
