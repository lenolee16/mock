import React from 'react';
import { Button } from 'antd';
import Link from 'umi/link';
import Result from '@/components/Result';
import styles from './RegisterResult.less';

const actions = (
  <div className={styles.actions}>
    <Link to="/">
      <Button size="large" type="primary">
        返回首页
      </Button>
    </Link>
  </div>
);

const RegisterResult = () => (
  <Result
    className={styles.registerResult}
    type="success"
    title={
      <div className={styles.title}>
        创建成功
      </div>
    }
    actions={actions}
    style={{ marginTop: 56 }}
  />
);

export default RegisterResult;
