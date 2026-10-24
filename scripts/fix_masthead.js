const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../frontend/src/App.jsx');
let content = fs.readFileSync(targetFile, 'utf8');

const startMarker = 'MASTHEAD / NAVBAR';
const endMarker = '{/* User Controls: Trái tim';

const mastheadCommentIdx = content.indexOf(startMarker);
if (mastheadCommentIdx === -1) {
  console.error('startMarker not found');
  process.exit(1);
}

// Find preceding '{/*'
const startIdx = content.lastIndexOf('{/*', mastheadCommentIdx);
const endIdx = content.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('startIdx or endIdx not found');
  process.exit(1);
}

const replacement = `{/* ─────────────────────────────────────────────────────────────
          MASTHEAD / NAVBAR: Chữ màu đen trên nền trắng
          ───────────────────────────────────────────────────────────── */}
      <header className="aj-masthead">
        <div className="aj-masthead-inner">
          
          {/* Logo Brand: Chữ màu đen trên nền trắng thanh lịch */}
          <div 
            onClick={() => navigateTo('home')}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}
          >
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              backgroundColor: '#000000',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Compass size={20} color="#ffffff" strokeWidth={2.4} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: '26px', fontWeight: 900, color: '#000000', letterSpacing: '-0.04em' }}>
                LonGo
              </span>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#000000', textTransform: 'uppercase', letterSpacing: '0.08em', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                TRAVEL
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="aj-nav-links">
            <button 
              onClick={() => navigateTo('home')}
              className={\`aj-nav-item \${currentTab === 'home' && !activePlace ? 'active' : ''}\`}
            >
              Trang chủ
            </button>

            <button 
              onClick={() => navigateTo('explore')}
              className={\`aj-nav-item \${currentTab === 'explore' && !activePlace ? 'active' : ''}\`}
            >
              Khám phá & Đánh giá
            </button>

            <button 
              onClick={() => navigateTo('ranking')}
              className={\`aj-nav-item \${currentTab === 'ranking' ? 'active' : ''}\`}
              style={{ fontWeight: 700 }}
            >
              Bảng xếp hạng
            </button>

            <button 
              onClick={() => navigateTo('calendar')}
              className={\`aj-nav-item \${currentTab === 'calendar' ? 'active' : ''}\`}
              style={{ fontWeight: 700 }}
            >
              Lịch du lịch
            </button>

            <button 
              onClick={() => navigateTo('map')}
              className={\`aj-nav-item \${currentTab === 'map' ? 'active' : ''}\`}
            >
              Bản đồ
            </button>

            <button 
              onClick={() => navigateTo('trip')}
              className={\`aj-nav-item \${currentTab === 'trip' ? 'active' : ''}\`}
            >
              Lập kế hoạch
            </button>

            <button 
              onClick={() => navigateTo('admin')}
              className={\`aj-nav-item \${currentTab === 'admin' ? 'active' : ''}\`}
              style={{ fontWeight: 700 }}
            >
              Báo cáo phân tích
            </button>
          </nav>

          `;

const newContent = content.substring(0, startIdx) + replacement + content.substring(endIdx);
fs.writeFileSync(targetFile, newContent, 'utf8');
console.log('Successfully fixed masthead and navigation links in App.jsx!');
