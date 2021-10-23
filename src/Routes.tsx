import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { Home } from './components/pages/Home'
import { VaultDetail } from './components/pages/VaultDetail'
import { Vaults } from './components/pages/Vaults'
import ScrollToTop from './utils/scrollToTop'

const routes = [
  {
    path: '/',
    component: Home,
    exact: true,
    key: 'index',
  },
  {
    path: '/dao/:daoAddress',
    component: Vaults,
    exact: true,
    key: '/dao/:daoAddress',
  },
  {
    path: '/dao/:daoAddress/treasury',
    component: VaultDetail,
    exact: true,
    key: '/dao/:daoAddress/treasury',
  },
  {
    path: '/dao/:daoAddress/minion/:minionAddress',
    component: VaultDetail,
    exact: true,
    key: '/dao/:daoAddress/minion/:minionAddress',
  },
]

export default function Routes() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        {routes.map((props) => (
          <Route {...props} />
        ))}
      </Switch>
    </>
  )
}
