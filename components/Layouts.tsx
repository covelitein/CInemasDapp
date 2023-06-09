import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout({ children }: any) {
  return (
    <div>
      <section className="h-screen flex">
        <Sidebar/>
        <div className="flex-1 overflow-auto">
            <Header />
            {children}
        </div>
      </section>
    </div>
  )
}
