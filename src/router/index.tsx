//#region Imports
import React from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import BasicLayout from '../layouts/BasicLayout';
import AuthRoute from '../components/AuthRoute';

// Pages
import Login from '../pages/Login';
import Overview from '../pages/Overview';
import CompanyClean from '../pages/Company/Clean';
import CompanyDatabase from '../pages/Company/Database';
import DrugClean from '../pages/Drug/Clean';
import DrugDatabase from '../pages/Drug/Database';
import IndicationClean from '../pages/Indication/Clean';
import IndicationDatabase from '../pages/Indication/Database';
import CenterClean from '../pages/Center/Clean';
import CenterDatabase from '../pages/Center/Database';
import TrialPhaseDatabase from '../pages/TrialPhase/Database';
//#endregion

//#region Routes Configuration
const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <AuthRoute>
        <BasicLayout />
      </AuthRoute>
    ),
    children: [
      { path: '/', element: <Navigate to="/overview" replace /> },
      { path: '/overview', element: <Overview /> },
      { path: '/company/clean', element: <CompanyClean /> },
      { path: '/company/database', element: <CompanyDatabase /> },
      { path: '/drug/clean', element: <DrugClean /> },
      { path: '/drug/database', element: <DrugDatabase /> },
      { path: '/indication/clean', element: <IndicationClean /> },
      { path: '/indication/database', element: <IndicationDatabase /> },
      { path: '/center/clean', element: <CenterClean /> },
      { path: '/center/database', element: <CenterDatabase /> },
      { path: '/trial-phase/database', element: <TrialPhaseDatabase /> },
    ],
  },
];
//#endregion

export default routes;
