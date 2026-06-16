//#region Imports
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, MessagePlugin, Card } from 'tdesign-react';
import { DesktopIcon, LockOnIcon } from 'tdesign-icons-react';
import { authApi } from '../../api';
//#endregion

//#region Component
const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: any) => {
    if (e.validateResult === true) {
      setLoading(true);
      try {
        const { username, password } = e.fields;
        const res: any = await authApi.login({ username, password });

        // 存储 Token
        const token = res.data?.token || res.data || res.token;
        if (token) {
          localStorage.setItem('token', typeof token === 'string' ? token : JSON.stringify(token));
        } else {
          // 兜底：如果没找到 token 字段则默认存储一个标识
          localStorage.setItem('token', 'mock_token_' + new Date().getTime());
        }

        MessagePlugin.success('登录成功');
        navigate('/overview', { replace: true });
      } catch (error) {
        console.error('登录异常', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="auth-page-wrapper"
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '10vh'
      }}>
        {/* Logo/Brand Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, var(--td-brand-color-4), var(--td-brand-color-7))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          marginBottom: '24px',
          boxShadow: '0 8px 24px rgba(3, 105, 161, 0.25)'
        }}>
          <DesktopIcon size="32px" />
        </div>

        <Card 
          bordered={false}
          style={{ 
            width: 420, 
            padding: '24px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.05)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ 
              margin: 0, 
              fontSize: '24px', 
              color: 'var(--td-text-color-primary)',
              letterSpacing: '-0.02em'
            }}>
              临床数据清洗系统
            </h1>
            <p style={{ margin: '8px 0 0 0', color: 'var(--td-text-color-secondary)', fontSize: '14px' }}>
              欢迎回来，请输入您的管理员账号
            </p>
          </div>

          <Form onSubmit={onSubmit} labelWidth={0}>
            <Form.FormItem name="username" rules={[{ required: true, message: '请输入账号' }]}>
              <Input size="large" prefixIcon={<DesktopIcon />} placeholder="请输入账号" clearable />
            </Form.FormItem>
            <Form.FormItem name="password" rules={[{ required: true, message: '请输入密码' }]} style={{ marginTop: 24 }}>
              <Input size="large" type="password" prefixIcon={<LockOnIcon />} placeholder="请输入密码" clearable />
            </Form.FormItem>
            <Form.FormItem style={{ marginTop: 32 }}>
              <Button size="large" theme="primary" type="submit" block loading={loading} style={{ height: '48px', fontSize: '16px' }}>
                登录
              </Button>
            </Form.FormItem>
          </Form>
        </Card>

        <div style={{ marginTop: 40, color: 'var(--td-text-color-placeholder)', fontSize: '13px' }}>
          &copy; {new Date().getFullYear()} Clinical Data Intelligence
        </div>
      </div>
    </div>
  );
};
//#endregion

export default Login;
