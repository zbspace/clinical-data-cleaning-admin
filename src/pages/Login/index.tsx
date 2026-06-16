//#region Imports
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, MessagePlugin, Card } from 'tdesign-react';
import { DesktopIcon, LockOnIcon } from 'tdesign-icons-react';
//#endregion

//#region Component
const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: any) => {
    if (e.validateResult === true) {
      setLoading(true);
      // 模拟接口调用延迟
      setTimeout(() => {
        setLoading(false);
        const { username, password } = e.fields;

        if (username === 'admin' && password === '123456') {
          // 模拟存储 Token
          localStorage.setItem('token', 'mock_token_' + new Date().getTime());
          MessagePlugin.success('登录成功');
          navigate('/overview', { replace: true });
        } else {
          MessagePlugin.error('账号或密码错误 (默认 admin/123456)');
        }
      }, 1000);
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3f4f5',
      }}
    >
      <Card title="临床数据清洗后台系统" style={{ width: 400, boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        <Form onSubmit={onSubmit} labelWidth={0}>
          <Form.FormItem name="username" rules={[{ required: true, message: '请输入账号' }]}>
            <Input size="large" prefixIcon={<DesktopIcon />} placeholder="请输入账号 (admin)" />
          </Form.FormItem>
          <Form.FormItem name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input size="large" type="password" prefixIcon={<LockOnIcon />} placeholder="请输入密码 (123456)" />
          </Form.FormItem>
          <Form.FormItem style={{ marginTop: 24 }}>
            <Button size="large" theme="primary" type="submit" block loading={loading}>
              登录
            </Button>
          </Form.FormItem>
        </Form>
      </Card>
    </div>
  );
};
//#endregion

export default Login;
