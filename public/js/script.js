let products = [];
let cart = [];
let currentCategory = 'Semua';
let currentUser = null;
let currentAttendanceId = null;
let pendingVoid = null;

// Mock data for initial visual (if DB is empty)
const mockProducts = [
    { id: '1', name: 'Es Kopi Susu Aren', price: 18000, category: 'Milk Based', img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=300&h=300&auto=format&fit=crop' },
    { id: '2', name: 'Americano', price: 15000, category: 'Espresso Based', img: 'assets/img/americano.jpg' },
    { id: '3', name: 'V60 Gayo', price: 25000, category: 'Manual Brew', img: 'https://images.unsplash.com/photo-1544787210-22c1ec479ec5?q=80&w=300&h=300&auto=format&fit=crop' },
    { id: '4', name: 'Matcha Latte', price: 22000, category: 'Non-Coffee', img: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=300&h=300&auto=format&fit=crop' },
    { id: '5', name: 'Caramel Macchiato', price: 28000, category: 'Milk Based', img: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=300&h=300&auto=format&fit=crop' },
    { id: '6', name: 'French Fries', price: 15000, category: 'Snack', img: 'https://images.unsplash.com/photo-1630384066272-11751df163cc?q=80&w=300&h=300&auto=format&fit=crop' },
    { id: '7', name: 'Croissant', price: 20000, category: 'Snack', img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=300&h=300&auto=format&fit=crop' }
];

function refreshIcons() {
    if (typeof lucide !== 'undefined') {
        try {
            lucide.createIcons();
        } catch (e) {
            console.error('Lucide error:', e);
        }
    }
}

async function init() {
    // Load persisted session from localStorage
    const savedUser = localStorage.getItem('gc_currentUser');
    const savedAttendance = localStorage.getItem('gc_attendanceId');

    if (savedUser && savedAttendance) {
        currentUser = JSON.parse(savedUser);
        currentAttendanceId = savedAttendance;
    }

    // Show login modal if not logged in
    if (!currentUser) {
        document.getElementById('loginModal').style.display = 'flex';
    } else {
        document.getElementById('loginModal').style.display = 'none';
        console.log(`Session restored: ${currentUser.username}`);
    }

    await fetchProducts();
    setupCategoryListeners();
    renderProducts();

    initVK(); // Initialize virtual keyboard
    refreshIcons();
}

async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        const data = await response.json();
        products = data.length > 0 ? data : mockProducts;
    } catch (error) {
        console.error('Fetcher error:', error);
        products = mockProducts;
    }
}

function setupCategoryListeners() {
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.innerText;
            renderProducts();
        });
    });
}

function renderProducts() {
    const grid = document.getElementById('productGrid');
    const searchInput = document.querySelector('.header .search-bar');
    const query = searchInput ? searchInput.value.toLowerCase() : '';

    if (!products || products.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px; color: var(--text-muted);">
                <i data-lucide="loader-2" class="spin" style="margin-bottom: 10px;"></i>
                <p>Memuat menu...</p>
            </div>
        `;
        refreshIcons();
        return;
    }

    // Filter by variant, category, and search query
    const filtered = products.filter(p => {
        const isVariant = p.name.includes('(Panas)') || p.name.includes('(Dingin)');
        const matchCategory = currentCategory === 'Semua' ? !isVariant : (p.category === currentCategory && !isVariant);
        const matchSearch = p.name.toLowerCase().includes(query);
        return matchCategory && matchSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px; color: var(--text-muted);">
                <p>Tidak ada produk ditemukan di kategori "${currentCategory}"</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(p => `
        <div class="product-card" onclick="checkVariants('${p.id}')">
            <img src="${p.image_url || p.img || 'https://via.placeholder.com/150'}" class="product-img" onerror="this.src='https://via.placeholder.com/150'">
            <div class="product-name">${p.name}</div>
            <div class="product-price">Rp ${Number(p.price).toLocaleString()}</div>
        </div>
    `).join('');
}

// Add Search Event Listener
document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.querySelector('.header .search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', () => {
            renderProducts();
        });
    }
});

function checkVariants(productId) {
    const baseProduct = products.find(p => p.id === productId);
    const hotVariant = products.find(p => p.name === baseProduct.name + ' (Panas)');
    const coldVariant = products.find(p => p.name === baseProduct.name + ' (Dingin)');

    if (hotVariant || coldVariant) {
        openVariantModal(baseProduct, hotVariant, coldVariant);
    } else {
        addToCart(productId);
    }
}

function openVariantModal(base, hot, cold) {
    const modal = document.getElementById('variantModal');
    document.getElementById('variantTitle').innerText = base.name;

    const btnHot = document.getElementById('btnHot');
    const btnCold = document.getElementById('btnCold');

    btnHot.onclick = () => { addToCart(hot.id); closeVariantModal(); };
    btnCold.onclick = () => { addToCart(cold.id); closeVariantModal(); };

    modal.style.display = 'flex';
}

function closeVariantModal() {
    document.getElementById('variantModal').style.display = 'none';
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, price: Number(product.price), qty: 1 });
    }
    updateCart();
}

function updateCart() {
    const container = document.getElementById('cartItems');
    if (cart.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: var(--text-muted); margin-top: 50px;"><p>Pilih menu untuk memulai</p></div>';
    } else {
        container.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div style="font-weight: 600;">${item.name}</div>
                    <div style="color: var(--accent);">Rp ${(Number(item.price) * item.qty).toLocaleString()}</div>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="changeQty('${item.id}', -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
                </div>
            </div>
        `).join('');
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = 0; // Tax set to 0% as requested
    const total = subtotal;

    document.getElementById('subtotal').innerText = `Rp ${subtotal.toLocaleString()}`;
    document.getElementById('tax').innerText = `Rp ${tax.toLocaleString()}`;
    document.getElementById('grandTotal').innerText = `Rp ${total.toLocaleString()}`;
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    if (delta < 0 && (item.qty === 1 || currentUser.role !== 'ADMIN')) {
        // Prepare for void authorization
        pendingVoid = { id, delta };
        openVoidModal(item);
        return;
    }

    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== id);
    }
    updateCart();
}

// --- AUTH & VOID LOGIC ---
function attemptLogin() {
    const username = document.getElementById('loginUser').value;
    const pin = document.getElementById('loginPin').value;

    fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, pin })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                currentUser = data.user;
                currentAttendanceId = data.attendance_id;

                // Persist session
                localStorage.setItem('gc_currentUser', JSON.stringify(currentUser));
                localStorage.setItem('gc_attendanceId', currentAttendanceId);

                document.getElementById('loginModal').style.display = 'none';
                document.getElementById('loginPin').value = '';
                alert(`Absen Masuk Berhasil! Selamat bekerja, ${currentUser.username}!`);
            } else {
                alert(data.message);
            }
        });
}

async function logout() {
    if (currentAttendanceId && confirm('Konfirmasi Absen Pulang (Logout)?')) {
        await fetch('/api/auth/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ attendance_id: currentAttendanceId })
        });

        // Clear session
        currentUser = null;
        currentAttendanceId = null;
        localStorage.removeItem('gc_currentUser');
        localStorage.removeItem('gc_attendanceId');

        document.getElementById('loginModal').style.display = 'flex';
    }
}

function openVoidModal(item) {
    const modal = document.getElementById('voidModal');
    document.getElementById('btnConfirmVoid').onclick = () => confirmVoid(item);
    modal.style.display = 'flex';
}

function closeVoidModal() {
    document.getElementById('voidModal').style.display = 'none';
    pendingVoid = null;
}

async function confirmVoid(item) {
    const reason = document.getElementById('voidReason').value;

    // Log the void
    await fetch('/api/auth/void-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: currentUser.id,
            product_name: item.name,
            price: item.price,
            reason: reason
        })
    });

    // Execute the removal
    if (pendingVoid.delta < 0) {
        item.qty += pendingVoid.delta;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== pendingVoid.id);
        }
    }

    updateCart();
    closeVoidModal();
    alert('Penghapusan item dicatat dalam sistem.');
}

function togglePaymentSelection() {
    const status = document.getElementById('paymentStatus').value;
    const area = document.getElementById('paymentSelectionArea');
    area.style.display = (status === 'PAID') ? 'block' : 'none';
}

document.getElementById('btnCheckout').addEventListener('click', async () => {
    if (cart.length === 0) return alert('Keranjang kosong!');

    let customerName = document.getElementById('customerName').value;
    if (!customerName) {
        customerName = `Kasir: ${currentUser.username}`;
    }

    const paymentStatus = document.getElementById('paymentStatus').value;
    const paymentMethod = document.getElementById('paymentMethod').value;

    const shouldPrint = paymentStatus === 'PAID' && document.getElementById('checkPrint').checked;

    const payload = {
        invoice_number: `INV-${Date.now()}`,
        items: cart.map(item => ({
            id: item.id, // for printer service if it needs name etc
            name: item.name,
            product_id: item.id,
            qty: item.qty,
            price: item.price
        })),
        total: cart.reduce((sum, item) => sum + (item.price * item.qty), 0), // Removed 1.1 multiplier (0% tax)
        payment_method: paymentMethod,
        customer_name: customerName,
        payment_status: paymentStatus,
        should_print: shouldPrint
    };

    try {
        const response = await fetch('/api/sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...payload, creator_id: currentUser.id })
        });

        const result = await response.json();
        if (result.success) {
            let msg = paymentStatus === 'PAID' ? 'Transaksi Berhasil!' : 'Pesanan disimpan ke daftar Pending.';

            if (result.print && result.print.success) {
                msg += `\n${result.print.message}`;
            } else if (shouldPrint) {
                msg += `\n⚠️ Gagal mencetak struk: ${result.print?.error || 'Sedang simulasi server'}`;
            }

            alert(`${msg}\nCustomer: ${customerName}\nInvoice: ${payload.invoice_number}`);
            cart = [];
            document.getElementById('customerName').value = '';
            document.getElementById('paymentStatus').value = 'PAID';
            togglePaymentSelection();
            updateCart();
        } else {
            alert('Gagal: ' + result.error);
        }
    } catch (error) {
        alert('Terjadi kesalahan koneksi ke server.');
    }
});

// --- Navigation Logic ---
function switchPage(page) {
    const pages = {
        'kasir': document.getElementById('kasirPage'),
        'stok': document.getElementById('stokPage'),
        'report': document.getElementById('reportPage'),
        'pending': document.getElementById('pendingPage'),
        'bms': document.getElementById('bmsPage'),
        'system': document.getElementById('systemPage')
    };

    const cartSection = document.getElementById('cartSection');
    const navItems = {
        'kasir': document.getElementById('navKasir'),
        'stok': document.getElementById('navStok'),
        'report': document.getElementById('navReport'),
        'pending': document.getElementById('navPending'),
        'bms': document.getElementById('navBMS'),
        'system': document.getElementById('navSystem')
    };

    // Hide all pages and remove active classes
    Object.keys(pages).forEach(p => {
        if (pages[p]) pages[p].style.display = 'none';
        if (navItems[p]) navItems[p].classList.remove('active');
    });

    // Show target page
    if (pages[page]) pages[page].style.display = 'block';
    if (navItems[page]) navItems[page].classList.add('active');

    // Cart visibility
    cartSection.style.display = (page === 'kasir') ? 'flex' : 'none';

    // Page-specific loaders
    if (page === 'kasir') renderProducts();
    if (page === 'stok') loadStokData();
    if (page === 'report') loadReportData();
    if (page === 'pending') loadPendingSales();
    if (page === 'bms') loadBMSData();
}

// --- BMS Logic ---
async function loadBMSData() {
    try {
        const response = await fetch('/api/bms/devices');
        const result = await response.json();

        if (result.success) {
            const devices = result.data || []; // Handle data format from API
            if (!Array.isArray(devices)) return;

            // 1. Update Core Stats (Watts, Temp, Water)
            const kwh = devices.find(d => d.category === 'ELECTRIC');
            const temp = devices.find(d => d.category === 'HVAC' && d.type === 'SENSOR');
            const water = devices.find(d => d.category === 'WATER');

            if (kwh) document.querySelector('#bmsPage .report-grid .card:nth-child(1) h2').innerHTML = `${kwh.current_value} <span style="font-size: 1rem; color: var(--text-muted);">${kwh.unit}</span>`;
            if (temp) document.querySelector('#bmsPage .report-grid .card:nth-child(2) h2').innerHTML = `${temp.current_value} <span style="font-size: 1rem; color: var(--text-muted);">°${temp.unit === 'Celsius' ? 'C' : temp.unit}</span>`;
            if (water) document.querySelector('#bmsPage .report-grid .card:nth-child(3) h2').innerHTML = `${water.current_value} <span style="font-size: 1rem; color: var(--text-muted);">${water.unit}</span>`;

            // 2. Render Lighting/Actuator Controls
            const actuators = devices.filter(d => d.type === 'ACTUATOR');
            const controlContainer = document.querySelector('#bmsPage .card:first-of-type div[style*="flex-direction: column"]');

            if (controlContainer && actuators.length > 0) {
                controlContainer.innerHTML = actuators.map(d => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: var(--glass); border-radius: 12px;">
                        <div style="display: flex; gap: 15px; align-items: center;">
                            <i data-lucide="${d.category === 'LIGHTING' ? 'lightbulb' : 'wind'}" style="color: ${d.current_value === 'ON' ? 'var(--accent)' : 'var(--text-muted)'};"></i>
                            <span>${d.name}</span>
                        </div>
                        <button class="category-btn ${d.current_value === 'ON' ? 'active' : ''}" 
                                onclick="toggleBMSDevice('${d.id}', '${d.current_value === 'ON' ? 'OFF' : 'ON'}')" 
                                style="padding: 5px 15px;">
                            ${d.current_value}
                        </button>
                    </div>
                `).join('');
            }

            // 3. Render Health Table
            const tableBody = document.querySelector('#bmsPage table.data-table tbody');
            if (tableBody) {
                tableBody.innerHTML = devices.map(d => `
                    <tr>
                        <td>${d.name}</td>
                        <td><span style="color: ${d.is_active ? 'var(--success)' : 'var(--danger)'};">● ${d.is_active ? 'Active' : 'Offline'}</span></td>
                        <td>${d.type === 'SENSOR' ? '92%' : '-'}</td>
                    </tr>
                `).join('');
            }

            refreshIcons();
        }
    } catch (error) {
        console.error('BMS Fetch Error:', error);
    }
}

async function toggleBMSDevice(id, newValue) {
    try {
        const response = await fetch(`/api/bms/devices/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: newValue })
        });
        const result = await response.json();
        if (result.success) {
            loadBMSData(); // Refresh UI
        }
    } catch (error) {
        alert('Gagal mengontrol perangkat BMS');
    }
}

// --- Report Logic ---
async function loadReportData() {
    const dateInput = document.getElementById('reportDate');
    if (!dateInput.value) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }

    const selectedDate = dateInput.value;
    const selectedShift = document.getElementById('reportShift').value || 1;

    try {
        // Fetch Daily (Selected Shift)
        const dailyRes = await fetch(`/api/reports/daily?date=${selectedDate}&shift=${selectedShift}`);
        const daily = await dailyRes.json();
        if (daily.success) {
            document.getElementById('dailyRevenue').innerText = `Rp ${Number(daily.data.summary.gross_revenue || 0).toLocaleString()}`;
            document.getElementById('dailyCount').innerText = `${daily.data.summary.total_transactions || 0} Transaksi`;

            // Render Top Products
            const topBody = document.getElementById('topProductsBody');
            topBody.innerHTML = daily.data.top_products.map(p => `
                <tr>
                    <td>${p.name}</td>
                    <td style="font-weight: bold;">${p.total_qty} terjual</td>
                </tr>
            `).join('');
        }

        // Fetch Weekly
        const weeklyRes = await fetch('/api/reports/weekly');
        const weekly = await weeklyRes.json();
        if (weekly.success) {
            document.getElementById('weeklyRevenue').innerText = `Rp ${Number(weekly.data.summary.gross_revenue || 0).toLocaleString()}`;
            document.getElementById('weeklyCount').innerText = `${weekly.data.summary.total_transactions || 0} Transaksi`;
        }

        // Fetch Monthly
        const monthlyRes = await fetch('/api/reports/monthly');
        const monthly = await monthlyRes.json();
        if (monthly.success) {
            document.getElementById('monthlyRevenue').innerText = `Rp ${Number(monthly.data.summary.gross_revenue || 0).toLocaleString()}`;
            document.getElementById('monthlyCount').innerText = `${monthly.data.summary.total_transactions || 0} Transaksi`;
        }

        // Fetch Current Inventory Status
        const inventoryRes = await fetch('/api/reports/inventory');
        const inventoryData = await inventoryRes.json();
        if (inventoryData.success) {
            const tbody = document.getElementById('inventoryStatusBody');
            tbody.innerHTML = inventoryData.data.map(m => `
                <tr>
                    <td style="font-weight: 600;">${m.name}</td>
                    <td style="font-weight: bold; color: ${m.stock <= 100 ? 'var(--danger)' : 'var(--success)'};">
                        ${Number(m.stock).toLocaleString()}
                    </td>
                    <td>${m.unit}</td>
                </tr>
            `).join('');
        }

        // Fetch Audit Stok (Opname) report
        const opnameFilter = document.getElementById('opnameFilter').value;
        const opnameRes = await fetch(`/api/stock/opname/history?filter=${opnameFilter}&date=${selectedDate}`);
        const opnameData = await opnameRes.json();

        if (opnameData.success) {
            const tbody = document.getElementById('reportOpnameBody');
            tbody.innerHTML = opnameData.data.map(h => {
                const diffClass = h.difference < 0 ? 'diff-minus' : (h.difference > 0 ? 'diff-plus' : '');
                const diffSign = h.difference > 0 ? '+' : '';
                return `
                    <tr>
                        <td style="font-weight: 600;">${h.material_name}</td>
                        <td>${h.system_stock} ${h.unit}</td>
                        <td style="font-weight: bold;">${h.physical_stock} ${h.unit}</td>
                        <td class="${diffClass}">${diffSign}${h.difference} ${h.unit}</td>
                        <td style="font-size: 0.85rem; color: var(--text-muted)">${h.note || '-'}</td>
                    </tr>
                `;
            }).join('');

            if (opnameData.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted)">Tidak ada data audit untuk periode ini</td></tr>';
            }
        }

        // Update Recent Transactions
        const recentBody = document.getElementById('recentSalesBody');
        if (daily.data.recent_sales) {
            recentBody.innerHTML = daily.data.recent_sales.map(s => `
                <tr>
                    <td>${new Date(s.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</td>
                    <td style="font-size: 0.85rem;">${s.invoice_number}</td>
                    <td style="font-weight: 600;">${s.customer_name}</td>
                    <td>Rp ${Number(s.total).toLocaleString()}</td>
                    <td>
                        <span style="color: ${s.payment_status === 'PAID' ? 'var(--success)' : 'var(--danger)'}">
                            ${s.payment_status === 'PAID' ? 'LUNAS' : 'PENDING'}
                        </span>
                        <br><small style="color: var(--text-muted)">${s.payment_method || '-'}</small>
                    </td>
                    <td>
                        <button class="category-btn" onclick="reprintSale('${s.id}')" style="padding: 5px 10px; font-size: 0.8rem; background: var(--glass);">
                            <i data-lucide="printer" style="width: 14px; position: relative; top: 2px;"></i> Cetak
                        </button>
                    </td>
                </tr>
            `).join('');
            refreshIcons();
        }

        // Update Void Logs (New v2.4 Audit)
        const voidRes = await fetch('/api/auth/void-logs');
        const voidData = await voidRes.json();
        if (voidData.success && voidData.data) {
            const voidBody = document.getElementById('reportVoidBody');
            if (voidBody) {
                voidBody.innerHTML = voidData.data.map(v => `
                    <tr>
                        <td>${new Date(v.created_at).toLocaleTimeString('id-ID')}</td>
                        <td>${v.staff_name || 'System'}</td>
                        <td style="font-weight: 600;">${v.product_name}</td>
                        <td>Rp ${Number(v.price).toLocaleString()}</td>
                        <td style="color: var(--danger); font-style: italic;">${v.reason}</td>
                    </tr>
                `).join('');
                if (voidData.data.length === 0) {
                    voidBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted)">Belum ada log penghapusan</td></tr>';
                }
            }
        }

        // --- NEW: Update Attendance Logs (Weekly Audit) ---
        const attendanceRes = await fetch('/api/auth/attendance');
        const attendanceData = await attendanceRes.json();
        if (attendanceData.success && attendanceData.data) {
            const attBody = document.getElementById('reportAttendanceBody');
            if (attBody) {
                attBody.innerHTML = attendanceData.data.map(a => `
                    <tr>
                        <td style="font-weight: 600;">${a.staff_name}</td>
                        <td style="color: var(--success);">${new Date(a.clock_in).toLocaleString('id-ID')}</td>
                        <td style="color: ${a.clock_out ? 'var(--text)' : 'var(--accent)'};">
                            ${a.clock_out ? new Date(a.clock_out).toLocaleString('id-ID') : '<i>Masih Bertugas</i>'}
                        </td>
                        <td>
                            <span style="font-size: 0.8rem; padding: 2px 8px; border-radius: 4px; background: ${a.clock_out ? 'var(--glass)' : 'rgba(228, 168, 83, 0.2)'}">
                                ${a.clock_out ? 'Selesai' : 'Aktif'}
                            </span>
                        </td>
                    </tr>
                `).join('');
                if (attendanceData.data.length === 0) {
                    attBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-muted)">Belum ada data absensi minggu ini</td></tr>';
                }
            }
        }

        // --- NEW: Update AI Smart Audit Insights (v2.5) ---
        try {
            const aiRes = await fetch('/api/auth/ai-insights');
            const aiData = await aiRes.json();
            if (aiData.success && aiData.data) {
                const aiContainer = document.getElementById('aiInsightContainer');
                const aiList = document.getElementById('aiInsightList');
                if (aiContainer && aiList) {
                    aiContainer.style.display = 'block';
                    aiList.innerHTML = aiData.data.map(i => `
                        <div style="margin-bottom: 10px; padding-left: 15px; border-left: 3px solid ${i.severity === 'HIGH' ? 'var(--danger)' : 'var(--accent)'};">
                            <span style="font-weight: bold; color: ${i.severity === 'HIGH' ? 'var(--danger)' : 'var(--accent)'}; text-transform: uppercase; font-size: 0.8rem;">
                                [${i.type}]
                            </span> 
                            ${i.message}
                        </div>
                    `).join('');
                }
            }
        } catch (aiErr) {
            console.warn('AI Insights offline:', aiErr);
            const aiList = document.getElementById('aiInsightList');
            if (aiList) {
                aiList.innerHTML = `<div style="color: var(--text-muted); font-style: italic;">
                    <i data-lucide="brain-circuit" style="width:14px; vertical-align:middle; opacity: 0.5;"></i> 
                    Server sedang offline. Analisa AI tidak tersedia saat ini.
                </div>`;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        }

    } catch (error) {
        console.error('Report Error:', error);
    }
}

async function reprintSale(id) {
    try {
        const res = await fetch(`/api/sales/reprint/${id}`, { method: 'POST' });
        const result = await res.json();
        if (result.success) {
            alert('Perintah cetak ulang berhasil dikirim!');
        } else {
            alert('Gagal cetak ulang: ' + (result.message || result.error || 'Server error'));
        }
    } catch (error) {
        alert('Kesalahan koneksi saat cetak ulang.');
    }
}

// --- Stock Opname Logic ---
async function loadStokData() {
    await fetchMaterials();
    await fetchOpnameHistory();
}

async function fetchMaterials() {
    try {
        const response = await fetch('/api/stock/materials');
        const result = await response.json();
        const select = document.getElementById('opnameMaterial');

        if (result.success) {
            select.innerHTML = result.data.map(m =>
                `<option value="${m.id}">${m.name} | Unit: ${m.unit} | Stok Sistem: ${Number(m.stock).toLocaleString()}</option>`
            ).join('');
        }
    } catch (error) {
        console.error('Fetch materials error:', error);
    }
}

async function fetchOpnameHistory() {
    try {
        const response = await fetch('/api/stock/opname/history');
        const result = await response.json();
        const tbody = document.getElementById('opnameHistoryBody');

        if (result.success) {
            if (result.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 30px;">Belum ada riwayat opname untuk periode ini</td></tr>';
                return;
            }

            tbody.innerHTML = result.data.map(h => {
                const diffClass = h.difference < 0 ? 'diff-minus' : (h.difference > 0 ? 'diff-plus' : '');
                const diffSign = h.difference > 0 ? '+' : '';
                return `
                    <tr>
                        <td style="font-size: 0.8rem; color: var(--text-muted)">
                            ${new Date(h.created_at).toLocaleString('id-ID')}
                        </td>
                        <td style="font-weight: 600;">${h.material_name}</td>
                        <td>${h.system_stock} ${h.unit}</td>
                        <td style="font-weight: bold;">${h.physical_stock} ${h.unit}</td>
                        <td class="${diffClass}">${diffSign}${h.difference} ${h.unit}</td>
                    </tr>
                `;
            }).join('');
        }
    } catch (error) {
        console.error('Fetch history error:', error);
    }
}

document.getElementById('btnSubmitOpname')?.addEventListener('click', async () => {
    const materialId = document.getElementById('opnameMaterial').value;
    const physicalStock = document.getElementById('opnameQty').value;
    const note = document.getElementById('opnameNote').value;

    if (!materialId || !physicalStock) return alert('Pilih bahan dan isi stok fisik!');

    try {
        const response = await fetch('/api/stock/opname', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                raw_material_id: materialId,
                physical_stock: parseFloat(physicalStock),
                note: note
            })
        });

        const result = await response.json();
        if (result.success) {
            alert('Stock Opname berhasil disimpan!');
            document.getElementById('opnameQty').value = '';
            document.getElementById('opnameNote').value = '';
            loadStokData(); // Refresh data
        } else {
            alert('Gagal: ' + result.message);
        }
    } catch (error) {
        alert('Terjadi kesalahan koneksi.');
    }
});

// --- Print Logic ---
async function openPrintPreview() {
    const reportDate = document.getElementById('reportDate').value;
    const reportShift = document.getElementById('reportShift').value || 1;

    // Fetch fresh daily data for payment breakdown
    const response = await fetch(`/api/reports/daily?date=${reportDate}&shift=${reportShift}`);
    const result = await response.json();

    if (result.success) {
        const data = result.data;
        document.getElementById('printRevenue').innerText = `Rp ${Number(data.summary.gross_revenue || 0).toLocaleString()}`;
        document.getElementById('printCount').innerText = data.summary.total_transactions || 0;

        // Payment breakdown
        const cash = data.payments.find(p => p.payment_method === 'CASH')?.total_amount || 0;
        const qris = data.payments.find(p => p.payment_method === 'QRIS')?.total_amount || 0;
        document.getElementById('printCash').innerText = `Rp ${Number(cash).toLocaleString()}`;
        document.getElementById('printQRIS').innerText = `Rp ${Number(qris).toLocaleString()}`;

        // Handle Pending Sales in Print Preview
        const pendingArea = document.getElementById('printPendingArea');
        const pendingList = document.getElementById('printPendingSales');
        if (data.pending_sales && data.pending_sales.length > 0) {
            pendingArea.style.display = 'block';
            pendingList.innerHTML = data.pending_sales.map(s => `
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span>- ${s.customer_name}</span>
                    <span style="font-weight:bold;">Rp ${Number(s.total).toLocaleString()}</span>
                </div>
            `).join('') + `
                <div style="text-align:right; border-top:1px dashed #000; margin-top:5px; padding-top:5px;">
                    <span style="font-weight:bold; color:#d32f2f;">Total Piutang: Rp ${data.pending_sales.reduce((sum, s) => sum + Number(s.total), 0).toLocaleString()}</span>
                </div>
            `;
        } else {
            pendingArea.style.display = 'none';
        }
    }

    const shiftLabel = reportShift == 1 ? "PAGI (06:00 - 17:00)" : "MALAM (17:00 - 03:00)";
    document.getElementById('printTimestamp').innerText = `Shift: ${shiftLabel}\nTanggal: ${reportDate} | Jam: ${new Date().toLocaleTimeString('id-ID')}`;

    // Fill Top Products (Top 3)
    const topRows = Array.from(document.querySelectorAll('#topProductsBody tr')).slice(0, 3);
    document.getElementById('printTopProducts').innerHTML = topRows.length > 0
        ? topRows.map(row => {
            const cells = row.querySelectorAll('td');
            return `<div style="display:flex; justify-content:space-between;"><span>${cells[0].innerText}</span> <span>${cells[1].innerText}</span></div>`;
        }).join('')
        : '<p style="font-style:italic;">Belum ada penjualan</p>';

    // Fill Inventory (Critical + Packaging)
    const inventoryRows = Array.from(document.querySelectorAll('#inventoryStatusBody tr'));
    const packagingKeywords = ['cup', 'sedotan', 'plastik', 'kertas'];

    const relevantItems = inventoryRows.filter(row => {
        const name = row.querySelectorAll('td')[0].innerText.toLowerCase();
        const stock = parseFloat(row.querySelectorAll('td')[1].innerText);
        const isPackaging = packagingKeywords.some(keyword => name.includes(keyword));
        return stock < 200 || isPackaging;
    });

    document.getElementById('printInventory').innerHTML = relevantItems.length > 0
        ? relevantItems.map(row => {
            const cells = row.querySelectorAll('td');
            const name = cells[0].innerText;
            const stockValue = parseFloat(cells[1].innerText);
            const color = stockValue < 100 ? 'red' : 'black';
            const weight = name.toLowerCase().includes('cup') ? 'bold' : 'normal';
            return `<div style="display:flex; justify-content:space-between; font-weight:${weight};"><span>${name}</span> <span style="color:${color}">${cells[1].innerText} ${cells[2].innerText}</span></div>`;
        }).join('')
        : '<p style="font-style:italic;">Stok aman</p>';

    document.getElementById('printModal').style.display = 'block';
}

function closePrintPreview() {
    document.getElementById('printModal').style.display = 'none';
}

// --- Pending Orders Logic ---
let pendingSalesData = [];

async function loadPendingSales() {
    try {
        const res = await fetch('/api/sales/pending');
        const result = await res.json();
        if (result.success) {
            pendingSalesData = result.data;
            renderPendingTable(pendingSalesData);
        }
    } catch (error) {
        console.error('Error loading pending sales:', error);
    }
}

function renderPendingTable(data) {
    const tbody = document.getElementById('pendingOrdersBody');
    tbody.innerHTML = data.map(s => `
        <tr>
            <td>${new Date(s.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</td>
            <td style="font-weight: 600;">${s.customer_name}</td>
            <td style="font-size: 0.9rem; color: var(--text-muted); max-width: 250px;">${s.items_summary || '-'}</td>
            <td>
                <div style="color: var(--danger); font-size: 0.75rem; font-weight: 800; margin-bottom: 2px;">🔴 BELUM BAYAR</div>
                <div style="color: var(--accent); font-weight: bold;">Rp ${Number(s.total).toLocaleString()}</div>
            </td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="category-btn" onclick="payPending('${s.id}', 'CASH')" style="background: #27ae60; color: white; border: none; padding: 6px 12px; font-size: 0.85rem;">💵 Tunai</button>
                    <button class="category-btn" onclick="payPending('${s.id}', 'QRIS')" style="background: #2980b9; color: white; border: none; padding: 6px 12px; font-size: 0.85rem;">📱 QRIS</button>
                    <button class="category-btn" onclick="reprintSale('${s.id}')" style="background: #e67e22; color: white; border: none; padding: 6px 12px; font-size: 0.85rem;">🖨️ Struk</button>
                    <button class="category-btn" onclick="openBill('${s.id}')" style="background: #8e44ad; color: white; border: none; padding: 6px 12px; font-size: 0.85rem;">➕ Tambah Menu</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterPending() {
    const query = document.getElementById('searchPending').value.toLowerCase();
    const filtered = pendingSalesData.filter(s =>
        s.customer_name.toLowerCase().includes(query) ||
        s.invoice_number.toLowerCase().includes(query)
    );
    renderPendingTable(filtered);
}

async function payPending(salesId, method) {
    if (!confirm(`Konfirmasi pelunasan dengan ${method}?`)) return;

    try {
        const res = await fetch(`/api/sales/complete/${salesId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payment_method: method })
        });
        const result = await res.json();
        if (result.success) {
            alert('Pembayaran Berhasil Dilunasi!');
            loadPendingSales();
        }
    } catch (error) {
        alert('Gagal memproses pembayaran.');
    }
}

async function openBill(salesId) {
    const sale = pendingSalesData.find(s => s.id === salesId);
    if (!sale) return;

    if (!confirm(`Tambahkan menu baru ke bill "${sale.customer_name}"?`)) return;

    // Transition to Kasir page
    switchPage('kasir');

    // Set UI state for Open Bill
    cart = []; // Start with new items only
    document.getElementById('customerName').value = sale.customer_name;
    document.getElementById('customerName').disabled = true;

    const btnBox = document.querySelector('.checkout-area');
    const originalBtn = document.getElementById('btnCheckout');
    originalBtn.style.display = 'none';

    // Add temporary Update Bill button
    const updateBtn = document.createElement('button');
    updateBtn.id = 'btnUpdateBill';
    updateBtn.className = 'btn-checkout';
    updateBtn.style.background = '#8e44ad';
    updateBtn.innerText = 'Update Bill (Tambah Menu)';
    updateBtn.onclick = async () => {
        if (cart.length === 0) return alert('Pilih menu terlebih dahulu!');

        try {
            const res = await fetch(`/api/sales/update-items/${salesId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart.map(item => ({
                        product_id: item.id,
                        qty: item.qty,
                        price: item.price
                    }))
                })
            });
            const result = await res.json();
            if (result.success) {
                alert('Bill berhasil diperbarui!');
                // Reset UI
                cart = [];
                updateCart();
                document.getElementById('customerName').value = '';
                document.getElementById('customerName').disabled = false;
                updateBtn.remove();
                originalBtn.style.display = 'block';
                switchPage('pending');
            }
        } catch (e) {
            alert('Gagal update bill.');
        }
    };

    // Add cancel button
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'category-btn';
    cancelBtn.style.width = '100%';
    cancelBtn.style.marginTop = '10px';
    cancelBtn.innerText = 'Batal Tambah Menu';
    cancelBtn.onclick = () => {
        cart = [];
        updateCart();
        document.getElementById('customerName').value = '';
        document.getElementById('customerName').disabled = false;
        updateBtn.remove();
        cancelBtn.remove();
        originalBtn.style.display = 'block';
    };

    btnBox.appendChild(updateBtn);
    btnBox.appendChild(cancelBtn);

    updateCart();
}

// --- VIRTUAL KEYBOARD LOGIC ---
let vkTarget = null;
let vkShift = false;

function initVK() {
    // Select all existing and future inputs
    document.addEventListener('focusin', (e) => {
        if (e.target.tagName === 'INPUT' && !['checkbox', 'radio', 'submit', 'button'].includes(e.target.type)) {
            const type = (e.target.id === 'loginPin' || e.target.type === 'number' || e.target.id === 'opnameQty') ? 'NUM' : 'QWERTY';
            showVK(e.target, type);
        }
    });

    // Prevent losing focus when clicking keys
    const panel = document.getElementById('vkPanel');
    if (panel) {
        panel.addEventListener('mousedown', e => e.preventDefault());
    }
}

function showVK(target, type) {
    vkTarget = target;
    const panel = document.getElementById('vkPanel');
    const title = document.getElementById('vkTitle');

    if (title) {
        title.innerText = (type === 'NUM') ? 'NUMERIC PAD' : 'QWERTY KEYBOARD';
    }
    renderVK(type);
    panel.classList.add('show');
}

function hideVK() {
    const panel = document.getElementById('vkPanel');
    if (panel) panel.classList.remove('show');
    vkTarget = null;
}

function renderVK(type) {
    const content = document.getElementById('vkContent');
    if (!content) return;

    if (type === 'NUM') {
        content.innerHTML = `
            <div class="numpad-grid">
                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '.', 'DEL'].map(k => `
                    <button class="vk-key numpad-key ${k === 'DEL' ? 'backspace' : ''}" onclick="pressVK('${k}', 'NUM')">
                        ${k === 'DEL' ? '<i data-lucide="delete"></i>' : k}
                    </button>
                `).join('')}
                <button class="vk-key numpad-key action" style="grid-column: span 3" onclick="hideVK()">SELESAI</button>
            </div>
        `;
    } else {
        const rows = [
            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
            ['SHIFT', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'DEL'],
            ['SPACE', 'DONE']
        ];

        content.innerHTML = rows.map(row => `
            <div class="vk-row">
                ${row.map(k => {
            let cls = 'vk-key';
            let label = k;
            if (k === 'SHIFT') {
                cls += ' wide action';
                if (vkShift) cls += ' active';
                label = '<i data-lucide="arrow-up-circle"></i>';
            }
            if (k === 'DEL') {
                cls += ' wide backspace';
                label = '<i data-lucide="delete"></i>';
            }
            if (k === 'SPACE') {
                cls += ' space';
                label = 'SPASI';
            }
            if (k === 'DONE') {
                cls += ' wide action';
                label = 'OK';
            }

            const displayVal = (vkShift && k.length === 1) ? k.toUpperCase() : label;
            return `<button class="${cls}" onclick="pressVK('${k}', 'QWERTY')">${displayVal}</button>`;
        }).join('')}
            </div>
        `).join('');
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function pressVK(k, type) {
    if (!vkTarget) return;

    if (k === 'DEL') {
        vkTarget.value = vkTarget.value.slice(0, -1);
    } else if (k === 'SHIFT') {
        vkShift = !vkShift;
        renderVK('QWERTY');
        return;
    } else if (k === 'DONE') {
        hideVK();
        vkTarget.blur();
    } else if (k === 'SPACE') {
        vkTarget.value += ' ';
    } else {
        let val = k;
        if (type === 'QWERTY' && vkShift) val = k.toUpperCase();
        vkTarget.value += val;
    }

    // Trigger input event manually
    vkTarget.dispatchEvent(new Event('input'));
}

// --- SYSTEM LOGIC ---
async function confirmShutdown() {
    // First Confirmation
    if (!confirm('Apakah Anda yakin ingin mematikan tablet ini?')) {
        return;
    }

    // Second Confirmation (Double check to prevent misclicks)
    if (!confirm('PERINGATAN TERAKHIR: Semua aplikasi akan ditutup dan tablet akan mati. Lanjutkan shutdown?')) {
        return;
    }

    try {
        const shutdownRes = await fetch('/api/system/shutdown', { method: 'POST' });
        const shutdownResult = await shutdownRes.json();

        if (shutdownResult.success) {
            alert(shutdownResult.message);
        } else {
            alert('Gagal mengirim perintah shutdown.');
        }
    } catch (e) {
        alert('Gagal menghubungi server.');
    }
}

// Init on load
init();
switchPage('kasir'); // Default page
