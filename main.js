// CYBERBEANS 主要JavaScript功能
class CyberbeansApp {
    constructor() {
        this.cart = [];
        this.compareList = [];
        this.products = [];
        this.init();
    }

    init() {
        this.initParticles();
        this.initScrollAnimations();
        this.initCart();
        this.initProductCarousel();
        this.initProductFilters();
        this.initCompareTool();
        this.initMobileMenu();
    }

    // 初始化粒子系统
    initParticles() {
        if (typeof p5 !== 'undefined') {
            new p5((p) => {
                let particles = [];
                
                p.setup = () => {
                    let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
                    canvas.parent('particles-container');
                    canvas.style('position', 'fixed');
                    canvas.style('top', '0');
                    canvas.style('left', '0');
                    canvas.style('z-index', '-1');
                    
                    // 创建粒子
                    for (let i = 0; i < 100; i++) {
                        particles.push({
                            x: p.random(p.width),
                            y: p.random(p.height),
                            vx: p.random(-0.5, 0.5),
                            vy: p.random(-0.5, 0.5),
                            size: p.random(1, 3)
                        });
                    }
                };
                
                p.draw = () => {
                    p.clear();
                    
                    // 绘制粒子
                    particles.forEach(particle => {
                        p.fill(0, 212, 255, 100);
                        p.noStroke();
                        p.circle(particle.x, particle.y, particle.size);
                        
                        // 更新位置
                        particle.x += particle.vx;
                        particle.y += particle.vy;
                        
                        // 边界检查
                        if (particle.x < 0 || particle.x > p.width) particle.vx *= -1;
                        if (particle.y < 0 || particle.y > p.height) particle.vy *= -1;
                    });
                };
                
                p.windowResized = () => {
                    p.resizeCanvas(p.windowWidth, p.windowHeight);
                };
            });
        }
    }

    // 初始化滚动动画
    initScrollAnimations() {
        if (typeof anime !== 'undefined') {
            // 页面加载动画
            anime({
                targets: '.hero-content',
                opacity: [0, 1],
                translateY: [50, 0],
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
                <div class="flex items-center justify-between p-4 border-b border-gray-700">
                    <div class="flex items-center space-x-3">
                        <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded">
                        <div>
                            <h4 class="text-white text-sm font-medium">${item.name}</h4>
                            <p class="text-gray-400 text-xs">¥${item.price}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="app.updateQuantity('${item.id}', -1)" class="text-gray-400 hover:text-white">-</button>
                        <span class="text-white">${item.quantity}</span>
                        <button onclick="app.updateQuantity('${item.id}', 1)" class="text-gray-400 hover:text-white">+</button>
                        <button onclick="app.removeFromCart('${item.id}')" class="text-red-400 hover:text-red-300 ml-2">×</button>
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
        notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full';
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
                    interval: 4000,
                    pauseOnHover: true,
                    arrows: false,
                    pagination: true,
                    speed: 1000
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
}

// 产品数据
const sampleProducts = [
    {
        id: 'cup-holder-pro',
        name: '智能杯架 Pro',
        price: 299,
        category: 'interior',
        image: 'resources/cup-holder-detail.jpg',
        description: '升级您的特斯拉杯架，智能温控，完美适配',
        rating: 4.8,
        reviews: 156
    },
    {
        id: 'air-filter-max',
        name: '高效空调滤芯 Max',
        price: 199,
        category: 'filter',
        image: 'resources/air-filter-technology.jpg',
        description: '三层过滤技术，99.9%过滤效率',
        rating: 4.9,
        reviews: 89
    },
    {
        id: 'mud-flap-sport',
        name: '运动挡泥板套装',
        price: 399,
        category: 'exterior',
        image: 'resources/tesla-model-y-accessories.jpg',
        description: '碳纤维纹理，完美贴合车身曲线',
        rating: 4.7,
        reviews: 234
    },
    {
        id: 'floor-mat-premium',
        name: '全包围脚垫 Premium',
        price: 599,
        category: 'interior',
        image: 'resources/product-showcase.jpg',
        description: 'TPE材质，防水防滑，易清洁',
        rating: 4.8,
        reviews: 167
    }
];

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CyberbeansApp();
    
    // 添加示例产品到全局
    window.sampleProducts = sampleProducts;
    
    // 初始化产品卡片点击事件
    setTimeout(() => {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                const product = sampleProducts.find(p => p.id === productId);
                if (product) {
                    window.app.addToCart(product);
                }
            });
        });
    }, 100);
});