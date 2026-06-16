//#region Imports
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Dropdown, Button, MessagePlugin } from 'tdesign-react';
import {
  DashboardIcon,
  BuildingIcon,
  HelpCircleIcon,
  CheckCircleIcon,
  LocationIcon,
  TimeIcon,
  LogoutIcon,
} from 'tdesign-icons-react';
//#endregion

//#region Constants
const { Header, Content, Aside } = Layout;
const { SubMenu, MenuItem } = Menu;
//#endregion

//#region Component
const BasicLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const activeValue = location.pathname;

  //#region Handlers
  const handleLogout = () => {
    localStorage.removeItem('token');
    MessagePlugin.success('已退出登录');
    navigate('/login', { replace: true });
  };
  //#endregion

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Aside style={{ borderRight: '1px solid var(--td-border-level-1-color)', backgroundColor: '#fff', boxShadow: '1px 0 10px rgba(0,0,0,0.02)' }}>
        <Menu
          value={activeValue}
          collapsed={collapsed}
          onChange={(value) => navigate(value as string)}
          logo={
            <div style={{ 
              padding: '20px 16px', 
              fontSize: '18px', 
              fontFamily: 'var(--td-font-family-medium)',
              fontWeight: 700, 
              color: 'var(--td-brand-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              letterSpacing: '-0.02em'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, var(--td-brand-color-5), var(--td-brand-color-8))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '14px',
                flexShrink: 0
              }}>
                <CheckCircleIcon />
              </div>
              {!collapsed && <span>临床数据系统</span>}
            </div>
          }
        >
          {/* #region Menu Items */}
          <MenuItem value="/overview" icon={<DashboardIcon />}>
            总览
          </MenuItem>

          <SubMenu value="/company" title="公司" icon={<BuildingIcon />}>
            <MenuItem value="/company/clean">公司名清洗</MenuItem>
            <MenuItem value="/company/database">公司名库</MenuItem>
          </SubMenu>

          <SubMenu value="/drug" title="药品" icon={<HelpCircleIcon />}>
            <MenuItem value="/drug/clean">药品名称清洗</MenuItem>
            <MenuItem value="/drug/database">药品名库管理</MenuItem>
          </SubMenu>

          <SubMenu value="/indication" title="适应症" icon={<CheckCircleIcon />}>
            <MenuItem value="/indication/clean">适应症名称清洗</MenuItem>
            <MenuItem value="/indication/database">适应症库管理</MenuItem>
          </SubMenu>

          <SubMenu value="/center" title="研究中心" icon={<LocationIcon />}>
            <MenuItem value="/center/clean">研究中心名称清洗</MenuItem>
            <MenuItem value="/center/database">研究中心库</MenuItem>
          </SubMenu>

          <SubMenu value="/trial-phase" title="试验分期" icon={<TimeIcon />}>
            <MenuItem value="/trial-phase/database">试验分期库管理</MenuItem>
          </SubMenu>
          {/* #endregion */}
        </Menu>
      </Aside>
      <Layout>
        {/* #region Header */}
        <Header
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--td-border-level-1-color)',
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            height: '64px'
          }}
        >
          <div style={{ flex: 1 }}>
             <span style={{ fontFamily: 'var(--td-font-family-medium)', fontSize: '15px', color: 'var(--td-text-color-secondary)' }}>
                {activeValue === '/overview' ? '系统总览' : '数据清洗与管理'}
             </span>
          </div>
          <Dropdown options={[{ content: '退出登录', value: 'logout', onClick: handleLogout }]}>
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '20px', background: '#f1f5f9', transition: 'all 0.2s' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--td-brand-color-2)', color: 'var(--td-brand-color-8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 12 }}>A</div>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--td-text-color-primary)' }}>管理员</span>
            </div>
          </Dropdown>
        </Header>
        {/* #endregion */}

        {/* #region Content */}
        <Content style={{ padding: '10px', overflow: 'auto', backgroundColor: 'var(--td-bg-color-page)' }}>
          <div style={{ minHeight: '100%', borderRadius: 'var(--td-radius-large)' }}>
            <Outlet />
          </div>
        </Content>
        {/* #endregion */}
      </Layout>
    </Layout>
  );
};
//#endregion

export default BasicLayout;
