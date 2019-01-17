import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Checkbox, Alert } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';

const { UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    autoLogin: true,
  };

  handleSubmit = (err, values) => {
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
        },
      });
    }
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <UserName
            name="userName"
            placeholder="用户名"
            rules={[
              {
                required: true,
                message: "请输入用户名",
              },
            ]}
          />
          <Password
            name="password"
            placeholder="密码"
            rules={[
              {
                required: true,
                message: "请输入密码",
              },
            ]}
            onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
          />
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              记住密码
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              忘记密码
            </a>
          </div>
          <Submit loading={submitting}>
            登录
          </Submit>
          <div className={styles.other}>
            <Link className={styles.register} to="/user/register">
              注册
            </Link>
          </div>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
