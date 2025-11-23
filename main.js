// CYBERBEANS 苹果风格网站主要JavaScript功能
class CyberbeansApp {
    constructor() {
        this.cart = [];
        this.compareList = [];
        this.products = [];
        this.currentDropdown = null;
        this.init();
    }

    init() {
        this.initNavigation();
        this.initScrollAnimations();
        this.initCart();
        this.initProductCarousel();
        this.initProductFilters();
        this.initCompareTool();
        this.initMobileMenu();
        this.initSmoothScrolling();
    }

    // 初始化苹果风格导航
    initNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const dropdowns = document.querySelectorAll('.dropdown-menu');

        navItems.forEach(item => {
            const dropdown = item.querySelector('.dropdown-menu');
            if (dropdown) {
                item.addEventListener('mouseenter', () => {
                    this.showDropdown(dropdown);
                });
                
                item.addEventListener('mouseleave', () => {
                    this.hideDropdown(dropdown);
                });
            }
        });

        // 点击外部关闭下拉菜单
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-item')) {
                this.hideAllDropdowns();
            }
        });
    }

    showDropdown(dropdown) {
        this.hideAllDropdowns();
        this.currentDropdown = dropdown;
        
        anime({
            targets: dropdown,
            opacity: [0, 1],
            translateY: [-10, 0],
            duration: 300,
            easing: 'easeOutQuart',
            begin: () => {
                dropdown.style.display = 'block';
            }
        });
    }

    hideDropdown(dropdown) {
        anime({
            targets: dropdown,
            opacity: [1, 0],
            translateY: [0, -10],
            duration: 200,
            easing: 'easeInQuart',
            complete: () => {
                dropdown.style.display = 'none';
            }
        });
        this.currentDropdown = null;
    }

    hideAllDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown-menu');
        dropdowns.forEach(dropdown => {
            if (dropdown.style.display !== 'none') {
                this.hideDropdown(dropdown);
            }
        });
    }

    // 初始化滚动动画
    initScrollAnimations() {
        if (typeof anime !== 'undefined') {
            // 页面加载动画
            anime({
                targets: '.hero-content',
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 1000,
                easing: 'easeOutQuart'
            });

            // 滚动触发动画
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        
                        if (target.classList.contains('product-card')) {
                            anime({
                                targets: target,
                                opacity: [0, 1],
                                translateY: [30, 0],
                                duration: 600,
                                delay: anime.stagger(100),
                                easing: 'easeOutQuart'
                            });
                        }
                        
                        if (target.classList.contains('feature-section')) {
                            anime({
                                targets: target.querySelectorAll('.feature-item'),
                                opacity: [0, 1],
                                translateX: [-50, 0],
                                duration: 800,
                                delay: anime.stagger(200),
                                easing: 'easeOutQuart'
                            });
                        }
                    }
                });
            }, observerOptions);

            // 观察所有需要动画的元素
            document.querySelectorAll('.product-card, .feature-section').forEach(el => {
                observer.observe(el);
            });
        }
    }

    // 初始化购物车功能
    initCart() {
        const cartIcon = document.getElementById('cart-icon');
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartClose = document.getElementById('cart-close');
        const cartOverlay = document.getElementById('cart-overlay');

        if (cartIcon) {
            cartIcon.addEventListener('click', () => {
                this.toggleCart();
            });
        }

        if (cartClose) {
            cartClose.addEventListener('click', () => {
                this.closeCart();
            });
        }

        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => {
                this.closeCart();
            });
        }
    }

    toggleCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.toggle('translate-x-full');
            cartOverlay.classList.toggle('hidden');
        }
    }

    closeCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.add('translate-x-full');
            cartOverlay.classList.add('hidden');
        }
    }

    // 添加到购物车
    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }
        
        this.updateCartUI();
        this.showCartNotification(product.name);
    }

    // 更新购物车UI
    updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
        
        if (cartTotal) {
            cartTotal.textContent = `¥${totalPrice.toFixed(2)}`;
        }
        
        if (cartItems) {
            cartItems.innerHTML = this.cart.map(item => `
                <div class="flex items-center justify-between p-4 border-b border-gray-200">
                    <div class="flex items-center space-x-3">
                        <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded">
                        <div>
                            <h4 class="text-gray-900 text-sm font-medium">${item.name}</h4>
                            <p class="text-gray-500 text-xs">¥${item.price}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="app.updateQuantity('${item.id}', -1)" class="text-gray-400 hover:text-gray-600">-</button>
                        <span class="text-gray-900">${item.quantity}</span>
                        <button onclick="app.updateQuantity('${item.id}', 1)" class="text-gray-400 hover:text-gray-600">+</button>
                        <button onclick="app.removeFromCart('${item.id}')" class="text-red-500 hover:text-red-700 ml-2">×</button>
                    </div>
                </div>
            `).join('');
        }
    }

    // 更新商品数量
    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.updateCartUI();
            }
        }
    }

    // 从购物车移除商品
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.updateCartUI();
    }

    // 显示购物车通知
    showCartNotification(productName) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full';
        notification.textContent = `${productName} 已添加到购物车`;
        document.body.appendChild(notification);
        
        // 动画显示
        anime({
            targets: notification,
            translateX: [100, 0],
            duration: 300,
            easing: 'easeOutQuart'
        });
        
        // 3秒后自动消失
        setTimeout(() => {
            anime({
                targets: notification,
                translateX: [0, 100],
                opacity: [1, 0],
                duration: 300,
                easing: 'easeInQuart',
                complete: () => {
                    document.body.removeChild(notification);
                }
            });
        }, 3000);
    }

    // 初始化产品轮播
    initProductCarousel() {
        if (typeof Splide !== 'undefined') {
            const heroCarousel = document.getElementById('hero-carousel');
            if (heroCarousel) {
                new Splide(heroCarousel, {
                    type: 'loop',
                    autoplay: true,
                    interval: 5000,
                    pauseOnHover: true,
                    arrows: false,
                    pagination: true,
                    speed: 1000,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }).mount();
            }

            // 产品轮播
            const productCarousel = document.getElementById('product-carousel');
            if (productCarousel) {
                new Splide(productCarousel, {
                    type: 'loop',
                    perPage: 4,
                    perMove: 1,
                    gap: '2rem',
                    autoplay: true,
                    interval: 4000,
                    pauseOnHover: true,
                    arrows: true,
                    pagination: false,
                    breakpoints: {
                        1024: { perPage: 3 },
                        768: { perPage: 2 },
                        480: { perPage: 1 }
                    }
                }).mount();
            }
        }
    }

    // 初始化产品筛选
    initProductFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const productCards = document.querySelectorAll('.product-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                
                // 更新按钮状态
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // 筛选产品
                productCards.forEach(card => {
                    const category = card.dataset.category;
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        anime({
                            targets: card,
                            opacity: [0, 1],
                            scale: [0.8, 1],
                            duration: 400,
                            easing: 'easeOutQuart'
                        });
                    } else {
                        anime({
                            targets: card,
                            opacity: [1, 0],
                            scale: [1, 0.8],
                            duration: 400,
                            easing: 'easeInQuart',
                            complete: () => {
                                card.style.display = 'none';
                            }
                        });
                    }
                });
            });
        });
    }

    // 初始化产品对比工具
    initCompareTool() {
        const compareButtons = document.querySelectorAll('.compare-btn');
        const comparePanel = document.getElementById('compare-panel');
        const compareList = document.getElementById('compare-list');
        
        compareButtons.forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.dataset.productId;
                const productName = button.dataset.productName;
                
                if (this.compareList.length < 3 && !this.compareList.find(item => item.id === productId)) {
                    this.compareList.push({
                        id: productId,
                        name: productName
                    });
                    this.updateCompareUI();
                }
            });
        });
    }

    // 更新对比工具UI
    updateCompareUI() {
        const comparePanel = document.getElementById('compare-panel');
        const compareCount = document.getElementById('compare-count');
        
        if (compareCount) {
            compareCount.textContent = this.compareList.length;
        }
        
        if (comparePanel) {
            if (this.compareList.length > 0) {
                comparePanel.classList.remove('hidden');
            } else {
                comparePanel.classList.add('hidden');
            }
        }
    }

    // 初始化移动端菜单
    initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }

    // 初始化平滑滚动
    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // 滚动到产品区域
    scrollToProducts() {
        const productsSection = document.querySelector('#products-section');
        if (productsSection) {
            productsSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// 苹果风格产品数据
const appleStyleProducts = [
    {
        id: 'mud-flap-model3',
        name: 'Model 3 挡泥板',
        price: 299,
        category: 'model3',
        type: 'mud-flap',
        model: 'model3',
        image: 'resources/model-3-interior.jpg',
        description: '专为Model 3设计，完美贴合，有效防护',
        rating: 4.8,
        reviews: 156,
        features: ['完美贴合', '有效防护', '易安装', '耐用材质']
    },
    {
        id: 'air-filter-model3',
        name: 'Model 3 空调滤芯',
        price: 199,
        category: 'model3',
        type: 'air-filter',
        model: 'model3',
        image: 'resources/air-filter-technology.jpg',
        description: '高效过滤，清新空气，原厂品质',
        rating: 4.9,
        reviews: 89,
        features: ['高效过滤', '原厂品质', '易更换', '长效使用']
    },
    {
        id: 'floor-mat-model3',
        name: 'Model 3 脚垫套装',
        price: 599,
        category: 'model3',
        type: 'floor-mat',
        model: 'model3',
        image: 'resources/product-showcase.jpg',
        description: 'TPE材质，防水防滑，全包围设计',
        rating: 4.8,
        reviews: 167,
        features: ['TPE材质', '防水防滑', '全包围设计', '环保无味']
    },
    {
        id: 'screen-protector-model3',
        name: 'Model 3 屏幕钢化膜',
        price: 159,
        category: 'model3',
        type: 'screen-protector',
        model: 'model3',
        image: 'resources/cup-holder-detail.jpg',
        description: '9H硬度，高清透光，防指纹',
        rating: 4.7,
        reviews: 234,
        features: ['9H硬度', '高清透光', '防指纹', '易安装']
    },
    {
        id: 'mud-flap-modely',
        name: 'Model Y 挡泥板',
        price: 329,
        category: 'modely',
        type: 'mud-flap',
        model: 'modely',
        image: 'resources/model-y-exterior.jpg',
        description: '碳纤维纹理，完美贴合，提升外观',
        rating: 4.8,
        reviews: 145,
        features: ['碳纤维纹理', '完美贴合', '提升外观', '防腐蚀']
    },
    {
        id: 'air-filter-modely',
        name: 'Model Y 空调滤芯',
        price: 219,
        category: 'modely',
        type: 'air-filter',
        model: 'modely',
        image: 'resources/air-filter-technology.jpg',
        description: '三层过滤，99.9%过滤效率',
        rating: 4.9,
        reviews: 98,
        features: ['三层过滤', '99.9%效率', '长效使用', '原厂规格']
    },
    {
        id: 'trunk-mat-modely',
        name: 'Model Y 后备箱垫',
        price: 399,
        category: 'modely',
        type: 'trunk-mat',
        model: 'modely',
        image: 'resources/tesla-model-y-accessories.jpg',
        description: 'TPE材质，防水防污，完美贴合',
        rating: 4.7,
        reviews: 189,
        features: ['TPE材质', '防水防污', '完美贴合', '易清洁']
    },
    {
        id: 'wiper-modely',
        name: 'Model Y 雨刮器',
        price: 279,
        category: 'modely',
        type: 'wiper',
        model: 'modely',
        image: 'resources/cup-holder-detail.jpg',
        description: '专用设计，静音刮水，清晰视野',
        rating: 4.6,
        reviews: 167,
        features: ['专用设计', '静音刮水', '清晰视野', '耐用材质']
    },
    {
        id: 'mud-flap-models',
        name: 'Model S 挡泥板',
        price: 349,
        category: 'models',
        type: 'mud-flap',
        model: 'models',
        image: 'resources/model-s-accessories.jpg',
        description: '豪华版挡泥板，提升外观品质',
        rating: 4.8,
        reviews: 123,
        features: ['豪华版', '提升外观', '易安装', '耐用材质']
    },
    {
        id: 'air-filter-models',
        name: 'Model S 空调滤芯',
        price: 249,
        category: 'models',
        type: 'air-filter',
        model: 'models',
        image: 'resources/air-filter-technology.jpg',
        description: '高效过滤系统，豪华车型专用',
        rating: 4.9,
        reviews: 87,
        features: ['高效过滤', '豪华专用', '易更换', '长效使用']
    },
    {
        id: 'pedal-models',
        name: 'Model S 刹车踏板',
        price: 429,
        category: 'models',
        type: 'pedal',
        model: 'models',
        image: 'resources/model-s-accessories.jpg',
        description: '铝合金踏板，运动风格，提升驾驶感受',
        rating: 4.7,
        reviews: 156,
        features: ['铝合金', '运动风格', '提升驾驶感受', '易安装']
    },
    {
        id: 'mud-flap-modelx',
        name: 'Model X 挡泥板',
        price: 379,
        category: 'modelx',
        type: 'mud-flap',
        model: 'modelx',
        image: 'resources/model-x-accessories.jpg',
        description: '大型SUV专用，强化防护',
        rating: 4.8,
        reviews: 98,
        features: ['大型专用', '强化防护', '易安装', '耐用材质']
    },
    {
        id: 'seat-protector-modelx',
        name: 'Model X 座椅防踢垫',
        price: 299,
        category: 'modelx',
        type: 'seat-protector',
        model: 'modelx',
        image: 'resources/model-x-accessories.jpg',
        description: '保护座椅背部，防止踢踏痕迹',
        rating: 4.6,
        reviews: 134,
        features: ['保护座椅', '防止踢踏', '易清洁', '完美贴合']
    },
    {
        id: 'jack-pad-modelx',
        name: 'Model X 千斤顶垫',
        price: 189,
        category: 'modelx',
        type: 'jack-pad',
        model: 'modelx',
        image: 'resources/model-x-accessories.jpg',
        description: '保护底盘，维修必备',
        rating: 4.5,
        reviews: 78,
        features: ['保护底盘', '维修必备', '易使用', '耐用材质']
    },
    {
        id: 'mud-flap-cybertruck',
        name: 'Cybertruck 挡泥板',
        price: 499,
        category: 'cybertruck',
        type: 'mud-flap',
        model: 'cybertruck',
        image: 'resources/cybertruck-accessories.jpg',
        description: '越野专用，强化防护，耐用材质',
        rating: 4.9,
        reviews: 67,
        features: ['越野专用', '强化防护', '耐用材质', '易安装']
    },
    {
        id: 'floor-mat-cybertruck',
        name: 'Cybertruck 脚垫',
        price: 699,
        category: 'cybertruck',
        type: 'floor-mat',
        model: 'cybertruck',
        image: 'resources/cybertruck-accessories.jpg',
        description: '越野专用脚垫，防水防污，易清洁',
        rating: 4.8,
        reviews: 89,
        features: ['越野专用', '防水防污', '易清洁', '耐用材质']
    }
];

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CyberbeansApp();
    
    // 添加示例产品到全局
    window.appleStyleProducts = appleStyleProducts;
    
    // 初始化产品卡片点击事件
    setTimeout(() => {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                const product = appleStyleProducts.find(p => p.id === productId);
                if (product) {
                    window.app.addToCart(product);
                }
            });
        });
    }, 100);
});