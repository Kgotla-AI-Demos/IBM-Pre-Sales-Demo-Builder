import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  HeaderContainer,
  Header,
  HeaderMenuButton,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
  SideNav,
  SideNavItems,
  SideNavMenuItem,
  Content,
  Loading,
} from '@carbon/react';
import Dashboard from '@carbon/icons-react/lib/dashboard/index.js';
import Warning from '@carbon/icons-react/lib/warning/index.js';
import ChartLineData from '@carbon/icons-react/lib/chart--line-data/index.js';
import Report from '@carbon/icons-react/lib/report/index.js';
import NetworkEnterprise from '@carbon/icons-react/lib/network--enterprise/index.js';
import Notification from '@carbon/icons-react/lib/notification/index.js';
import UserAvatar from '@carbon/icons-react/lib/user--avatar/index.js';
import { Link, useLocation } from 'react-router-dom';
import DemoBanner from './components/DemoBanner.jsx';
import './App.scss';

const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const ProblemPage = lazy(() => import('./pages/ProblemPage.jsx'));
const SolutionPage = lazy(() => import('./pages/SolutionPage.jsx'));
const ResultsPage = lazy(() => import('./pages/ResultsPage.jsx'));
const ArchitecturePage = lazy(() => import('./pages/ArchitecturePage.jsx'));

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
    <Loading description="Loading page..." withOverlay={false} />
  </div>
);

export default function App() {
  const location = useLocation();

  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <>
          <Header aria-label="Factory AI Predictive Maintenance">
            <SkipToContent />
            <HeaderMenuButton
              aria-label={isSideNavExpanded ? 'Close menu' : 'Open menu'}
              onClick={onClickSideNavExpand}
              isActive={isSideNavExpanded}
            />
            <HeaderName as={Link} to="/" prefix="IBM">
              Factory AI — Predictive Maintenance
            </HeaderName>
            <HeaderNavigation aria-label="Main navigation">
              <HeaderMenuItem as={Link} to="/" isCurrentPage={location.pathname === '/'}>
                Dashboard
              </HeaderMenuItem>
              <HeaderMenuItem as={Link} to="/problem" isCurrentPage={location.pathname === '/problem'}>
                Problem
              </HeaderMenuItem>
              <HeaderMenuItem as={Link} to="/solution" isCurrentPage={location.pathname === '/solution'}>
                AI Agent
              </HeaderMenuItem>
              <HeaderMenuItem as={Link} to="/results" isCurrentPage={location.pathname === '/results'}>
                Results
              </HeaderMenuItem>
              <HeaderMenuItem as={Link} to="/architecture" isCurrentPage={location.pathname === '/architecture'}>
                Architecture
              </HeaderMenuItem>
            </HeaderNavigation>
            <HeaderGlobalBar>
              <HeaderGlobalAction aria-label="Notifications" tooltipAlignment="end">
                <Notification size={20} />
              </HeaderGlobalAction>
              <HeaderGlobalAction aria-label="User profile" tooltipAlignment="end">
                <UserAvatar size={20} />
              </HeaderGlobalAction>
            </HeaderGlobalBar>

            <SideNav
              aria-label="Side navigation"
              expanded={isSideNavExpanded}
              isPersistent={false}
            >
              <SideNavItems>
                <SideNavMenuItem as={Link} to="/" isActive={location.pathname === '/'}>
                  <Dashboard size={16} /> &nbsp; Dashboard
                </SideNavMenuItem>
                <SideNavMenuItem as={Link} to="/problem" isActive={location.pathname === '/problem'}>
                  <Warning size={16} /> &nbsp; Problem Statement
                </SideNavMenuItem>
                <SideNavMenuItem as={Link} to="/solution" isActive={location.pathname === '/solution'}>
                  <ChartLineData size={16} /> &nbsp; AI Agent Demo
                </SideNavMenuItem>
                <SideNavMenuItem as={Link} to="/results" isActive={location.pathname === '/results'}>
                  <Report size={16} /> &nbsp; Outcomes & ROI
                </SideNavMenuItem>
                <SideNavMenuItem as={Link} to="/architecture" isActive={location.pathname === '/architecture'}>
                  <NetworkEnterprise size={16} /> &nbsp; Architecture
                </SideNavMenuItem>
              </SideNavItems>
            </SideNav>
          </Header>

          <div className="demo-banner-wrapper">
            <DemoBanner />
          </div>

          <Content className="main-content">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/problem" element={<ProblemPage />} />
                <Route path="/solution" element={<SolutionPage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/architecture" element={<ArchitecturePage />} />
              </Routes>
            </Suspense>
          </Content>
        </>
      )}
    />
  );
}
