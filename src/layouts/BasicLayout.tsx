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
      <Aside style={{ borderRight: '1px solid var(--td-component-border)' }}>
        <Menu
          value={activeValue}
          collapsed={collapsed}
          onChange={(value) => navigate(value as string)}
          logo={
            <div style={{ padding: '16px', fontSize: '18px', fontWeight: 'bold', color: 'var(--td-brand-color)' }}>
              {collapsed ? '数据' : '临床数据清洗系统'}
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
            background: '#fff',
            borderBottom: '1px solid var(--td-component-border)',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{ flex: 1 }}></div>
          <Dropdown options={[{ content: '退出登录', value: 'logout', onClick: handleLogout }]}>
            <Button variant="text" style={{ cursor: 'pointer' }}>
              管理员
            </Button>
          </Dropdown>
        </Header>
        {/* #endregion */}

        {/* #region Content */}
        <Content style={{ padding: '24px', overflow: 'auto', backgroundColor: '#f3f4f5' }}>
          <div style={{ backgroundColor: '#fff', minHeight: '100%', padding: '24px', borderRadius: '4px' }}>
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
