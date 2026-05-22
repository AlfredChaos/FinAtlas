import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import Dashboard from '@/pages/Dashboard'
import ImportCenter from '@/pages/ImportCenter'
import Ledger from '@/pages/Ledger'
import Investments from '@/pages/Investments'
import Categories from '@/pages/Categories'
import ReportDetail from '@/pages/ReportDetail'
import AiAssistant from '@/pages/AiAssistant'
import SettingsAccounts from '@/pages/SettingsAccounts'
import SettingsAudit from '@/pages/SettingsAudit'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/imports" element={<ImportCenter />} />
          <Route path="/ledger" element={<Ledger />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/reports/:month" element={<ReportDetail />} />
          <Route path="/ai" element={<AiAssistant />} />
          <Route path="/settings/accounts" element={<SettingsAccounts />} />
          <Route path="/settings/audit" element={<SettingsAudit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
