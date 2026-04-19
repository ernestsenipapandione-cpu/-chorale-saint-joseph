function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/merci" element={<Merci />} />

        {/* On enlève DashboardLayout et on met les routes normalement */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/members" element={<Members />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/partitions" element={<Partitions />} />
        <Route path="/live" element={<Live />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/finances" element={<Finances />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  )
}