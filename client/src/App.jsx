import { useState, useEffect } from 'react'
import { Package, Truck, Network, Activity } from 'lucide-react'

function App() {
  const [health, setHealth] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch Health
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(err => console.error('Health check failed', err))

    // Fetch Products
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch products', err)
        setLoading(false)
      })
  }, [])

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#646cff', padding: '10px', borderRadius: '8px' }}>
             <Network size={32} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Frostbite Warehouse</h1>
            <p style={{ margin: 0, opacity: 0.7 }}>Logistics Management System</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#333', padding: '0.5rem 1rem', borderRadius: '50px' }}>
          <Activity size={18} color={health?.status === 'healthy' ? '#4caf50' : '#f44336'} />
          <span>System Status: </span>
          <span className={`status-badge ${health?.status === 'healthy' ? 'status-healthy' : 'status-unhealthy'}`}>
            {health ? health.status.toUpperCase() : 'CHECKING...'}
          </span>
        </div>
      </header>

      <main>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2><Package style={{ verticalAlign: 'middle', marginRight: '10px' }} />Product Inventory</h2>
            <button onClick={() => window.location.reload()}>Refresh Data</button>
          </div>
          
          {loading ? (
             <p>Loading warehouse data...</p>
          ) : products.length > 0 ? (
            <div className="grid">
              {products.map((product) => (
                <div key={product.id || Math.random()} className="item-card">
                  <h3 style={{ margin: '0 0 10px 0' }}>{product.name}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', opacity: 0.8 }}>
                    <span>ID: {product.id}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>
              <Truck size={48} />
              <p>No products found in inventory.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
