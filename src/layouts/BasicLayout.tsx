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
  ViewListIcon,
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
      <Aside
        width={collapsed ? '64px' : '232px'}
        style={{
          borderRight: '1px solid var(--td-border-level-1-color)',
          backgroundColor: '#fff',
          boxShadow: '1px 0 10px rgba(0,0,0,0.02)',
          transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
          zIndex: 101,
          overflow: 'hidden',
        }}
      >
        <Menu
          value={activeValue}
          collapsed={collapsed}
          style={{ height: '100%', borderRight: 'none' }}
          onChange={(value) => navigate(value as string)}
          logo={
            <div
              style={{
                height: '56px',
                padding: collapsed ? '0' : '0 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                overflow: 'hidden',
                transition: 'all 0.3s',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, var(--td-brand-color-5), var(--td-brand-color-8))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  flexShrink: 0,
                  boxShadow: '0 4px 10px rgba(0, 82, 217, 0.2)',
                }}
              >
                <CheckCircleIcon size="18px" />
              </div>
              {!collapsed && (
                <span
                  style={{
                    marginLeft: '12px',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: 'var(--td-brand-color)',
                    whiteSpace: 'nowrap',
                    opacity: 1,
                    transition: 'opacity 0.3s',
                  }}
                >
                  临床数据系统
                </span>
              )}
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
      <Layout style={{ transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)' }}>
        {/* #region Header */}
        <Header
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--td-border-level-1-color)',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            height: '56px',
          }}
        >
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              variant="text"
              shape="square"
              onClick={() => setCollapsed(!collapsed)}
              style={{ 
                color: 'var(--td-text-color-secondary)',
                transition: 'transform 0.3s',
                transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)'
              }}
            >
              <ViewListIcon size="20px" />
            </Button>
            <span
              style={{
                fontFamily: 'var(--td-font-family-medium)',
                fontSize: '15px',
                color: 'var(--td-text-color-secondary)',
              }}
            >
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
