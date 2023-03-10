// default imports
import Head from 'next/head'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div>
      <Head>
        <title>ChainBridge Portal | View Medical Records and Other Information!</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div>
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout
