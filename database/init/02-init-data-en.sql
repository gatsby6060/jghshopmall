-- ============================================================
-- Categories (10)
-- ============================================================
INSERT IGNORE INTO categories (id, name, slug, description, sort_order, active, created_at, updated_at) VALUES
(1,  'Fashion',      'fashion',     'Trendy fashion items',              1,  true, NOW(), NOW()),
(2,  'Electronics',  'electronics', 'Latest electronics and appliances', 2,  true, NOW(), NOW()),
(3,  'Beauty',       'beauty',      'Skincare and makeup',               3,  true, NOW(), NOW()),
(4,  'Food/Health',  'food',        'Fresh food and health supplements', 4,  true, NOW(), NOW()),
(5,  'Sports',       'sports',      'Sports equipment and outdoor',      5,  true, NOW(), NOW()),
(6,  'Furniture',    'furniture',   'Furniture and interior items',      6,  true, NOW(), NOW()),
(7,  'Books',        'books',       'Books and stationery',              7,  true, NOW(), NOW()),
(8,  'Kids',         'kids',        'Baby products and toys',            8,  true, NOW(), NOW()),
(9,  'Pets',         'pets',        'Pet food and supplies',             9,  true, NOW(), NOW()),
(10, 'Auto',         'auto',        'Car accessories and supplies',      10, true, NOW(), NOW());

-- ============================================================
-- Fashion (category_id=1) - 30 products
-- ============================================================
INSERT IGNORE INTO products (name, description, price, discount_price, stock, thumbnail_url, category_id, brand, status, view_count, sales_count, featured, created_at, updated_at) VALUES
('Basic White T-Shirt',        'Classic 100% cotton white t-shirt',          19900,  15900,  200, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', 1, 'BASIC', 'ACTIVE', 520, 180, true,  NOW(), NOW()),
('Slim Black Denim',           'Slim-fit black jeans with stretch fabric',   59900,  45900,  80,  'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop', 1, 'DENIM', 'ACTIVE', 340, 95,  false, NOW(), NOW()),
('Oversized Grey Hoodie',      'Relaxed fit daily hoodie with fleece lining',49900,  NULL,   120, 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=400&fit=crop', 1, 'HOOD',  'ACTIVE', 280, 72,  true,  NOW(), NOW()),
('Classic Beige Trench Coat',  'Essential fall/spring trench coat',          149000, 119000, 30,  'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=400&fit=crop', 1, 'COAT',  'ACTIVE', 610, 28,  true,  NOW(), NOW()),
('White Canvas Sneakers',      'Classic white sneakers for any outfit',      69000,  55000,  150, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', 1, 'SHOES', 'ACTIVE', 890, 210, false, NOW(), NOW()),
('Stripe Oxford Shirt',        'Clean stripe pattern oxford shirt',          45000,  NULL,   60,  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop', 1, 'SHIRT', 'ACTIVE', 190, 35,  false, NOW(), NOW()),
('Wide Leg Black Slacks',      'Trendy wide-leg slacks for office or casual',55000,  42000,  90,  'https://images.unsplash.com/photo-1594938298603-c8148c4b4d3a?w=400&h=400&fit=crop', 1, 'PANTS', 'ACTIVE', 420, 88,  false, NOW(), NOW()),
('Cream Knit Cardigan',        'Soft V-neck cream cardigan for layering',    65000,  52000,  45,  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop', 1, 'KNIT',  'ACTIVE', 310, 62,  false, NOW(), NOW()),
('Floral Midi Skirt',          'Feminine floral pattern midi skirt',         45000,  NULL,   55,  'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=400&fit=crop', 1, 'SKIRT', 'ACTIVE', 260, 48,  false, NOW(), NOW()),
('Lightweight Goose Down Vest','Light and warm goose down vest',             189000, 149000, 40,  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop', 1, 'VEST',  'ACTIVE', 730, 95,  true,  NOW(), NOW()),
('Linen Wide Pants',           'Cool linen wide pants for summer',           42000,  32000,  70,  'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=400&fit=crop', 1, 'PANTS', 'ACTIVE', 180, 42,  false, NOW(), NOW()),
('Crop Denim Jacket',          'Vintage crop denim jacket',                  79000,  62000,  50,  'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=400&fit=crop', 1, 'DENIM', 'ACTIVE', 350, 78,  false, NOW(), NOW()),
('Black Turtleneck Knit',      'Sleek black turtleneck sweater',             55000,  NULL,   60,  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop', 1, 'KNIT',  'ACTIVE', 290, 65,  false, NOW(), NOW()),
('Check Pattern Shirt',        'Classic check pattern casual shirt',         38000,  29000,  80,  'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop', 1, 'SHIRT', 'ACTIVE', 220, 55,  false, NOW(), NOW()),
('Slip-on Loafers',            'Classic loafers for office looks',           89000,  72000,  35,  'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&h=400&fit=crop', 1, 'SHOES', 'ACTIVE', 410, 82,  false, NOW(), NOW()),
('Leather Mini Crossbody Bag', 'Luxury leather mini crossbody bag',          125000, 98000,  25,  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop', 1, 'BAG',   'ACTIVE', 580, 45,  true,  NOW(), NOW()),
('Straight Jeans',             'Classic straight-fit jeans',                 65000,  52000,  90,  'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop', 1, 'DENIM', 'ACTIVE', 480, 120, false, NOW(), NOW()),
('Oversized Check Coat',       'Trendy oversized check coat',                189000, 149000, 20,  'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=400&fit=crop', 1, 'COAT',  'ACTIVE', 650, 32,  true,  NOW(), NOW()),
('Stripe Basic Tee',           'Casual stripe short-sleeve t-shirt',         22000,  NULL,   180, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop', 1, 'BASIC', 'ACTIVE', 320, 95,  false, NOW(), NOW()),
('Pleated Midi Skirt',         'Elegant pleated midi skirt for office',      48000,  38000,  55,  'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=400&fit=crop', 1, 'SKIRT', 'ACTIVE', 270, 58,  false, NOW(), NOW()),
('Casual Jogger Pants',        'Comfortable jogger pants for home and out',  35000,  28000,  120, 'https://images.unsplash.com/photo-1594938298603-c8148c4b4d3a?w=400&h=400&fit=crop', 1, 'PANTS', 'ACTIVE', 380, 102, false, NOW(), NOW()),
('Linen Blazer',               'Cool linen blazer for summer office look',   89000,  72000,  30,  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=400&fit=crop', 1, 'BLAZER','ACTIVE', 420, 65,  false, NOW(), NOW()),
('Long Floral Dress',          'Bright floral pattern long dress',           75000,  58000,  40,  'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop', 1, 'DRESS', 'ACTIVE', 510, 78,  true,  NOW(), NOW()),
('Casual White Sneakers',      'Daily casual sneakers',                      55000,  42000,  100, 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop', 1, 'SHOES', 'ACTIVE', 620, 155, false, NOW(), NOW()),
('Wool Blend Scarf',           'Warm wool blend scarf in various colors',    35000,  NULL,   80,  'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=400&fit=crop', 1, 'ACC',   'ACTIVE', 190, 45,  false, NOW(), NOW()),
('Denim Overall',              'Trendy denim overall',                       72000,  58000,  35,  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop', 1, 'DENIM', 'ACTIVE', 280, 42,  false, NOW(), NOW()),
('Crop Hoodie Zip-up',         'Trendy crop hoodie zip-up',                  55000,  42000,  60,  'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=400&fit=crop', 1, 'HOOD',  'ACTIVE', 340, 72,  false, NOW(), NOW()),
('Vintage Wash Denim',         'Natural vintage wash denim pants',           68000,  NULL,   45,  'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop', 1, 'DENIM', 'ACTIVE', 310, 68,  false, NOW(), NOW()),
('Cashmere Touch Knit',        'Premium soft cashmere-like knit sweater',    89000,  72000,  30,  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop', 1, 'KNIT',  'ACTIVE', 260, 48,  false, NOW(), NOW()),
('Medium Shoulder Bag',        'Practical medium shoulder bag',              95000,  78000,  20,  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop', 1, 'BAG',   'ACTIVE', 450, 55,  false, NOW(), NOW());

-- ============================================================
-- Electronics (category_id=2) - 20 products
-- ============================================================
INSERT IGNORE INTO products (name, description, price, discount_price, stock, thumbnail_url, category_id, brand, status, view_count, sales_count, featured, created_at, updated_at) VALUES
('Ultralight Laptop 15inch',    'Under 1kg high-performance laptop i7 16GB', 1500000, 1350000, 20,  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop', 2, 'TechBook',   'ACTIVE', 1200, 45,  true,  NOW(), NOW()),
('Noise Cancelling Earbuds',    'Premium ANC wireless earbuds',              250000,  199000,  100, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', 2, 'SoundPro',   'ACTIVE', 1800, 320, true,  NOW(), NOW()),
('Smartwatch Pro S2',           'Health monitor GPS smartwatch',             350000,  299000,  50,  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', 2, 'WatchPro',   'ACTIVE', 950, 88,  false, NOW(), NOW()),
('4K UHD Smart TV 65inch',      '4K Netflix/YouTube built-in smart TV',      1200000, 990000,  15,  'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400&h=400&fit=crop', 2, 'ScreenMax',  'ACTIVE', 1500, 18,  true,  NOW(), NOW()),
('Fast Wireless Charger 3in1',  'Phone+Watch+Earbuds simultaneous 15W',      45000,   35000,   200, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop', 2, 'ChargePad',  'ACTIVE', 680, 185, false, NOW(), NOW()),
('Mechanical Keyboard TKL',     'Tenkeyless mechanical keyboard RGB',        120000,  89000,   40,  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop', 2, 'KeyMaster',  'ACTIVE', 580, 62,  false, NOW(), NOW()),
('Wireless Gaming Mouse Pro',   '1ms response ultra-light wireless mouse',   85000,   NULL,    60,  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop', 2, 'MousePro',   'ACTIVE', 420, 38,  false, NOW(), NOW()),
('Portable Bluetooth Speaker',  'IPX7 waterproof outdoor speaker',           79000,   59000,   80,  'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', 2, 'SoundBox',   'ACTIVE', 520, 72,  false, NOW(), NOW()),
('27inch QHD Gaming Monitor',   '2560x1440 165Hz gaming monitor',            350000,  299000,  25,  'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop', 2, 'ViewPro',    'ACTIVE', 780, 28,  false, NOW(), NOW()),
('Power Bank 30000mAh',         'PD 65W laptop-compatible power bank',       59000,   45000,   150, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop', 2, 'PowerBank',  'ACTIVE', 920, 215, true,  NOW(), NOW()),
('Mirrorless Camera Beginner',  '24MP entry-level mirrorless camera',        650000,  550000,  15,  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop', 2, 'SnapPro',    'ACTIVE', 1100, 22, true,  NOW(), NOW()),
('Tablet PC 11inch',            '2K display with keyboard cover included',   450000,  380000,  30,  'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop', 2, 'TabPro',     'ACTIVE', 850, 45,  false, NOW(), NOW()),
('Air Purifier 360 Clean',      'HEPA filter 99.97% dust/virus removal',     280000,  230000,  35,  'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop', 2, 'AirPure',    'ACTIVE', 620, 55,  false, NOW(), NOW()),
('Robot Vacuum Laser Mapping',  'Laser mapping auto-charge robot vacuum',    350000,  280000,  20,  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 2, 'CleanBot',   'ACTIVE', 980, 38,  true,  NOW(), NOW()),
('Smart Speaker AI',            'AI voice assistant smart home hub',         89000,   72000,   80,  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 2, 'SmartHub',   'ACTIVE', 450, 68,  false, NOW(), NOW()),
('USB-C Hub 8in1',              '8-port hub HDMI 4K PD 100W support',        45000,   35000,   120, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 2, 'HubPro',     'ACTIVE', 380, 92,  false, NOW(), NOW()),
('Gaming Headset 7.1ch',        '7.1 virtual surround noise-cancel mic',     89000,   72000,   45,  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', 2, 'SoundGame',  'ACTIVE', 520, 48,  false, NOW(), NOW()),
('Smart Scale BMI',             'BMI body fat muscle mass app-connected',    35000,   28000,   100, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 2, 'HealthScale','ACTIVE', 290, 75,  false, NOW(), NOW()),
('Electric Scooter Foldable',   'Max 25km/h 30km range foldable scooter',   450000,  380000,  10,  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 2, 'RideGo',     'ACTIVE', 1200, 15, true,  NOW(), NOW()),
('4K Action Camera Waterproof', '4K 60fps waterproof stabilized action cam',180000,  148000,  25,  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop', 2, 'ActionCam',  'ACTIVE', 680, 32,  false, NOW(), NOW());

-- ============================================================
-- Beauty (category_id=3) - 8 products
-- ============================================================
INSERT IGNORE INTO products (name, description, price, discount_price, stock, thumbnail_url, category_id, brand, status, view_count, sales_count, featured, created_at, updated_at) VALUES
('Hydrating Soothing Cream 50ml','Sensitive skin hydrating cream hyaluronic acid', 32000, 25000, 100, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop', 3, 'SkinLab',   'ACTIVE', 680, 125, true,  NOW(), NOW()),
('Vitamin C Brightening Serum', 'High-concentration 20% vitamin C serum',   45000, 35000, 80,  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop', 3, 'GlowUp',    'ACTIVE', 520, 98,  false, NOW(), NOW()),
('Mineral Sunscreen SPF50+',    'No white cast gentle mineral sunscreen',    28000, 19000, 150, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop', 3, 'SunGuard',  'ACTIVE', 890, 215, true,  NOW(), NOW()),
('Perfect Cover Cushion',       'All-day coverage SPF50+ PA++++',            38000, 28000, 90,  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 3, 'CoverFit',  'ACTIVE', 750, 168, true,  NOW(), NOW()),
('Mild Cleansing Foam',         'pH 5.5 gentle cleansing foam',              18000, 12000, 200, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop', 3, 'CleanPH',   'ACTIVE', 480, 112, false, NOW(), NOW()),
('Retinol Anti-Aging Cream',    'Wrinkle reduction 0.1% retinol cream',      55000, 42000, 60,  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop', 3, 'AgeLab',    'ACTIVE', 420, 88,  false, NOW(), NOW()),
('Sheet Mask Pack 10pcs',       'Daily hydrating sheet mask set',            20000, 10000, 300, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop', 3, 'MaskLab',   'ACTIVE', 1100, 320, true,  NOW(), NOW()),
('Matte Lipstick 10 Colors',    'High-pigment matte lipstick 10 shades',     25000, NULL,  60,  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 3, 'LipPro',    'ACTIVE', 380, 72,  false, NOW(), NOW());

-- ============================================================
-- Food/Health (category_id=4) - 7 products
-- ============================================================
INSERT IGNORE INTO products (name, description, price, discount_price, stock, thumbnail_url, category_id, brand, status, view_count, sales_count, featured, created_at, updated_at) VALUES
('Premium Red Ginseng 30pcs',  '6-year red ginseng 100% immunity boost',    120000, 89000, 30,  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop', 4, 'GinsengLab','ACTIVE', 620, 45,  true,  NOW(), NOW()),
('Probiotics 60pcs',           '10 billion live cultures gut health',        45000, 35000, 100, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', 4, 'ProbiLab',  'ACTIVE', 480, 125, true,  NOW(), NOW()),
('Chicken Breast Sausage 10pk','Low-calorie high-protein diet snack',        25000, 19900, 150, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop', 4, 'HealthFood','ACTIVE', 850, 285, true,  NOW(), NOW()),
('Multivitamin Mineral 90tabs','Daily one-tab 13 vitamins + minerals',       45000, 35000, 80,  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', 4, 'VitaLab',   'ACTIVE', 380, 92,  false, NOW(), NOW()),
('Protein Shake Chocolate 1kg','Tasty WPC protein supplement 25g/serving',  42000, 32000, 60,  'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop', 4, 'ProteinLab','ACTIVE', 520, 115, false, NOW(), NOW()),
('Organic Brown Rice 10kg',    'Pesticide-free certified organic brown rice',45000, 39000, 50,  'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&h=400&fit=crop', 4, 'OrganicFarm','ACTIVE', 290, 48,  false, NOW(), NOW()),
('Omega-3 Fish Oil 120caps',   'Blood circulation EPA+DHA 1000mg',           30000, 22000, 90,  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', 4, 'OmegaLab',  'ACTIVE', 340, 78,  false, NOW(), NOW());

-- ============================================================
-- Sports (category_id=5) - 6 products
-- ============================================================
INSERT IGNORE INTO products (name, description, price, discount_price, stock, thumbnail_url, category_id, brand, status, view_count, sales_count, featured, created_at, updated_at) VALUES
('Yoga Mat TPE 6mm',           'Eco-friendly non-slip joint protection mat', 35000, 25000, 100, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop', 5, 'YogaFit',   'ACTIVE', 520, 145, true,  NOW(), NOW()),
('Camping Tent 2-person',      '1.8kg ultralight backpacking tent',         150000, 120000, 20,  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=400&fit=crop', 5, 'CampPro',   'ACTIVE', 680, 28,  true,  NOW(), NOW()),
('Adjustable Dumbbell Set',    '2-20kg adjustable space-saving dumbbells',   85000, 65000, 30,  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop', 5, 'GymPro',    'ACTIVE', 450, 38,  false, NOW(), NOW()),
('Lightweight Bike Helmet',    'CE certified 250g ultralight helmet',        55000, 42000, 40,  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 5, 'SafeRide',  'ACTIVE', 320, 55,  false, NOW(), NOW()),
('Waterproof Hiking Boots',    'Gore-Tex waterproof ankle support boots',   120000, 95000, 35,  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', 5, 'HikePro',   'ACTIVE', 580, 72,  false, NOW(), NOW()),
('Sleeping Bag -10C',          'All-season camping sleeping bag to -10C',    85000, 65000, 40,  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=400&fit=crop', 5, 'SleepOut',  'ACTIVE', 420, 48,  false, NOW(), NOW());

-- ============================================================
-- Furniture (category_id=6) - 6 products
-- ============================================================
INSERT IGNORE INTO products (name, description, price, discount_price, stock, thumbnail_url, category_id, brand, status, view_count, sales_count, featured, created_at, updated_at) VALUES
('Ergonomic Mesh Chair',       'Lumbar support adjustable armrest chair',   180000, 149000, 30,  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', 6, 'ErgoChair', 'ACTIVE', 820, 48,  true,  NOW(), NOW()),
('Solid Wood Dining Set 4p',   'Rubber wood dining table + 4 chairs',       350000, 290000, 15,  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', 6, 'WoodHome',  'ACTIVE', 720, 18,  true,  NOW(), NOW()),
('LED Desk Lamp',              'Brightness and color temp adjustable lamp',  55000, 42000, 80,  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop', 6, 'LightArt',  'ACTIVE', 480, 88,  false, NOW(), NOW()),
('Memory Foam Topper Queen',   '7cm high-density memory foam mattress topper',120000, 89000, 40,  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', 6, 'SleepWell', 'ACTIVE', 650, 35,  true,  NOW(), NOW()),
('Blackout Curtain Set 2pcs',  '99% light blocking soundproof curtains',    55000, 39000, 80,  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 6, 'DarkRoom',  'ACTIVE', 380, 65,  false, NOW(), NOW()),
('Microfiber Rug 200x150',     'Soft large living room rug',                65000, 48000, 50,  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', 6, 'SoftRug',   'ACTIVE', 290, 42,  false, NOW(), NOW());

-- ============================================================
-- Books (category_id=7) - 5 products
-- ============================================================
INSERT IGNORE INTO products (name, description, price, discount_price, stock, thumbnail_url, category_id, brand, status, view_count, sales_count, featured, created_at, updated_at) VALUES
('2025 Weekly Planner',        'Efficient schedule management planner',      18000, 14400, 100, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop', 7, 'PlanPro',   'ACTIVE', 420, 115, true,  NOW(), NOW()),
('Bestseller Novel Set 3pcs',  'Top 3 most-loved novels of 2024',           45000, 40500, 60,  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop', 7, 'BookStore', 'ACTIVE', 580, 88,  true,  NOW(), NOW()),
('Premium Fountain Pen Set',   'Smooth writing fountain pen + 10 cartridges',55000, 42000, 40,  'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&h=400&fit=crop', 7, 'PenArt',    'ACTIVE', 280, 38,  false, NOW(), NOW()),
('Pastel Highlighter 12 Colors','Eye-friendly pastel tone 12 colors',        12000,  9000, 200, 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&h=400&fit=crop', 7, 'ColorPen',  'ACTIVE', 350, 125, false, NOW(), NOW()),
('Adjustable Book Stand',      '7-angle adjustable book/tablet stand',       25000, 19000, 80,  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop', 7, 'ReadStand', 'ACTIVE', 310, 68,  false, NOW(), NOW());

-- ============================================================
-- Kids (category_id=8) - 5 products
-- ============================================================
INSERT IGNORE INTO products (name, description, price, discount_price, stock, thumbnail_url, category_id, brand, status, view_count, sales_count, featured, created_at, updated_at) VALUES
('Organic Cotton Baby Pajamas','Organic cotton newborn to 24m pajama set',   35000, 25000, 100, 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=400&fit=crop', 8, 'BabyPure',  'ACTIVE', 520, 88,  true,  NOW(), NOW()),
('Kids LED Kick Scooter',      'Safe 3-wheel LED light scooter ages 3-8',    55000, 45000, 40,  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 8, 'KidRide',   'ACTIVE', 620, 78,  true,  NOW(), NOW()),
('Eco Wooden Blocks 100pcs',   'Non-toxic wooden creative building blocks',  45000, 35000, 50,  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 8, 'WoodPlay',  'ACTIVE', 380, 55,  false, NOW(), NOW()),
('Baby Wet Wipes 10packs',     'Thick soft embossed unscented wipes',        22000, 15000, 200, 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=400&fit=crop', 8, 'BabyWipe',  'ACTIVE', 720, 215, false, NOW(), NOW()),
('Silicone Baby Feeding Set',  'BPA-free silicone plate+bowl+spoon set',     32000, 25000, 80,  'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=400&fit=crop', 8, 'BabyEat',   'ACTIVE', 290, 65,  false, NOW(), NOW());

-- ============================================================
-- Pets (category_id=9) - 5 products
-- ============================================================
INSERT IGNORE INTO products (name, description, price, discount_price, stock, thumbnail_url, category_id, brand, status, view_count, sales_count, featured, created_at, updated_at) VALUES
('Premium Dog Food 5kg',       'Grain-free salmon joint and skin health',    55000, 45000, 60,  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop', 9, 'PetFeed',   'ACTIVE', 680, 95,  true,  NOW(), NOW()),
('Auto Pet Feeder',            'Smartphone control camera built-in feeder',  85000, 69000, 30,  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop', 9, 'AutoFeed',  'ACTIVE', 820, 38,  true,  NOW(), NOW()),
('Cat Tower 5 Level',          'Solid wood scratcher 5-level cat tower',    120000, 89000, 20,  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop', 9, 'CatTower',  'ACTIVE', 720, 28,  false, NOW(), NOW()),
('Dog Pee Pads 100pcs',        'Thick absorbent odor-blocking pee pads',     18000, 13000, 200, 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop', 9, 'PetPad',    'ACTIVE', 580, 185, false, NOW(), NOW()),
('Cat Treats Churu 40pcs',     'Top-rated tuna chicken mixed treats',        25000, 19000, 150, 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop', 9, 'CatSnack',  'ACTIVE', 650, 225, false, NOW(), NOW());

-- ============================================================
-- Auto (category_id=10) - 5 products
-- ============================================================
INSERT IGNORE INTO products (name, description, price, discount_price, stock, thumbnail_url, category_id, brand, status, view_count, sales_count, featured, created_at, updated_at) VALUES
('Fast Wireless Car Charger',  'Auto open/close 15W fast wireless charger',  45000, 35000, 80,  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 10, 'CarCharge', 'ACTIVE', 720, 135, true,  NOW(), NOW()),
('Car Air Purifier',           'HEPA filter dust and virus removal',          65000, 49000, 30,  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 10, 'AirCar',    'ACTIVE', 420, 55,  false, NOW(), NOW()),
('Car Wash Kit 7pcs',          'Complete self car wash kit foam+towel+wax',   48000, 38000, 40,  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 10, 'WashPro',   'ACTIVE', 380, 38,  false, NOW(), NOW()),
('Dashcam 2CH 4K',             'Front+rear 4K recording parking mode',       180000, 148000, 25, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 10, 'DashCam',   'ACTIVE', 850, 48,  true,  NOW(), NOW()),
('Tire Inflator Wireless',     'Smart wireless air pump auto pressure set',   55000, 45000, 40,  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 10, 'AirPump',   'ACTIVE', 320, 42,  false, NOW(), NOW());

-- Admin account (password: admin123)
INSERT IGNORE INTO users (email, password, name, role, provider, enabled, created_at, updated_at)
VALUES (
  'admin@shopmall.com',
  '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH',
  'Admin', 'ADMIN', 'LOCAL', true, NOW(), NOW()
);
