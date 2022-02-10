import React from 'react';

import './index.less';

interface LoginLayoutProps {
  Login: React.ReactNode;
}

export default function LoginLayout(props: LoginLayoutProps) {
  const { Login } = props;
  return (
    <div className="ts-web-test-app-login-layout-wrapper">
      <div className="main-area-wrapper">
        <div className="title-area">
          Tosee RTC Web SDK Demo
        </div>
        <div className="dividing-line" />
        <div className="login-area-wrapper">
          {Login}
        </div>
      </div>
    </div>
  );
}
