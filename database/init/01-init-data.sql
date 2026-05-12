-- ============================================================
-- 관리자 계정 (비밀번호: admin123)
-- ============================================================
INSERT IGNORE INTO users (email, password, name, role, provider, enabled, created_at, updated_at)
VALUES (
  'admin@shopmall.com',
  '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH',
  '관리자', 'ADMIN', 'LOCAL', true, NOW(), NOW()
);

-- 테스트 계정 (비밀번호: test1234!)
INSERT IGNORE INTO users (email, password, name, role, provider, enabled, created_at, updated_at)
VALUES (
  'test@shopmall.com',
  '$2a$10$X7oBkMfMKqXnS8K5GjLwXOqQzMXfbH.9VqGpJz3sDcpMxBJ5hKxYi',
  '테스트유저', 'USER', 'LOCAL', true, NOW(), NOW()
);

-- ============================================================
-- 카테고리 10개
-- ============================================================
INSERT IGNORE INTO categories (id, name, slug, description, sort_order, active, created_at, updated_at) VALUES
(1,  '패션/의류',    'fashion',     '트렌디한 패션 아이템',          1,  true, NOW(), NOW()),
(2,  '전자제품',     'electronics', '최신 전자기기 및 가전',          2,  true, NOW(), NOW()),
(3,  '뷰티/화장품',  'beauty',      '스킨케어, 메이크업 등',          3,  true, NOW(), NOW()),
(4,  '식품/건강',    'food',        '신선식품, 건강기능식품',          4,  true, NOW(), NOW()),
(5,  '스포츠/레저',  'sports',      '스포츠용품, 아웃도어',           5,  true, NOW(), NOW()),
(6,  '가구/인테리어', 'furniture',  '가구, 조명, 인테리어 소품',       6,  true, NOW(), NOW()),
(7,  '도서/문구',    'books',       '도서, 문구, 오피스용품',          7,  true, NOW(), NOW()),
(8,  '유아/아동',    'kids',        '유아용품, 아동 의류 및 완구',     8,  true, NOW(), NOW()),
(9,  '반려동물',     'pets',        '반려동물 사료, 용품, 간식',       9,  true, NOW(), NOW()),
(10, '자동차용품',   'auto',        '차량용품, 세차용품, 블랙박스',    10, true, NOW(), NOW());

-- ============================================================
-- 패션/의류 (category_id=1) - 30개
-- Unsplash 패션 이미지 사용
-- ============================================================
INSERT IGNORE INTO products (name, description, price, discount_price, stock, thumbnail_url, category_id, brand, status, view_count, sales_count, featured, created_at, updated_at) VALUES
('베이직 화이트 티셔츠',      '365일 입을 수 있는 깔끔한 화이트 티셔츠. 100% 순면 소재.',          19900,  15900,  200, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', 1, 'BASIC', 'ACTIVE', 520, 180, true,  NOW(), NOW()),
('슬림핏 블랙 데님',          '다리가 길어보이는 슬림핏 블랙 청바지. 스트레치 소재.',              59900,  45900,  80,  'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop', 1, 'DENIM', 'ACTIVE', 340, 95,  false, NOW(), NOW()),
('오버핏 그레이 후드',        '루즈한 핏감의 데일리 후드티. 기모 안감으로 따뜻함.',               49900,  NULL,   120, 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=400&fit=crop', 1, 'HOOD',  'ACTIVE', 280, 72,  true,  NOW(), NOW()),
('클래식 베이지 트렌치코트',  '가을/봄 필수 아이템. 클래식한 베이지 트렌치코트.',                 149000, 119000, 30,  'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=400&fit=crop', 1, 'COAT',  'ACTIVE', 610, 28,  true,  NOW(), NOW()),
('화이트 캔버스 스니커즈',    '어디에나 잘 어울리는 클래식 화이트 스니커즈.',                     69000,  55000,  150, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', 1, 'SHOES', 'ACTIVE', 890, 210, false, NOW(), NOW()),
('스트라이프 옥스포드 셔츠',  '깔끔한 스트라이프 패턴의 옥스포드 셔츠. 오피스룩에 최적.',          45000,  NULL,   60,  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop', 1, 'SHIRT', 'ACTIVE', 190, 35,  false, NOW(), NOW()),
('와이드 슬랙스 블랙',        '편안하고 트렌디한 와이드 슬랙스. 오피스룩과 캐주얼 모두 OK.',       55000,  42000,  90,  'https://images.unsplash.com/photo-1594938298603-c8148c4b4d3a?w=400&h=400&fit=crop', 1, 'PANTS', 'ACTIVE', 420, 88,  false, NOW(), NOW()),
('크림 니트 가디건',          '부드러운 촉감의 크림색 브이넥 가디건. 레이어드룩에 필수.',           65000,  52000,  45,  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop', 1, 'KNIT',  'ACTIVE', 310, 62,  false, NOW(), NOW()),
('플로럴 미디 스커트',        '여성스러운 플로럴 패턴의 미디 기장 스커트.',                       45000,  NULL,   55,  'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=400&fit=crop', 1, 'SKIRT', 'ACTIVE', 260, 48,  false, NOW(), NOW()),
('경량 구스다운 패딩',        '가볍고 따뜻한 구스다운 패딩. 수납 파우치 포함.',                   189000, 149000, 40,  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop', 1, 'VEST',  'ACTIVE', 730, 95,  true,  NOW(), NOW()),
('린넨 와이드 팬츠',          '시원한 린넨 소재의 와이드 팬츠. 여름 필수 아이템.',                 42000,  32000,  70,  'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=400&fit=crop', 1, 'PANTS', 'ACTIVE', 180, 42,  false, NOW(), NOW()),
('크롭 데님 자켓',            '빈티지 감성의 크롭 데님 자켓. 다양한 스타일링 가능.',               79000,  62000,  50,  'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=400&fit=crop', 1, 'DENIM', 'ACTIVE', 350, 78,  false, NOW(), NOW()),
('블랙 터틀넥 니트',          '세련된 블랙 터틀넥 니트. 가을/겨울 필수 아이템.',                  55000,  NULL,   60,  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop', 1, 'KNIT',  'ACTIVE', 290, 65,  false, NOW(), NOW()),
('체크 패턴 셔츠',            '클래식 체크 패턴 셔츠. 캐주얼하게 입기 좋은 아이템.',              38000,  29000,  80,  'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop', 1, 'SHIRT', 'ACTIVE', 220, 55,  false, NOW(), NOW()),
('슬립온 로퍼',               '편안하게 신을 수 있는 클래식 로퍼. 오피스룩에 완벽.',               89000,  72000,  35,  'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&h=400&fit=crop', 1, 'SHOES', 'ACTIVE', 410, 82,  false, NOW(), NOW()),
('레더 미니 크로스백',        '고급스러운 레더 소재의 미니 크로스백. 데일리 필수템.',              125000, 98000,  25,  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop', 1, 'BAG',   'ACTIVE', 580, 45,  true,  NOW(), NOW()),
('스트레이트 청바지',         '클래식한 스트레이트 핏 청바지. 어떤 상의와도 잘 어울림.',           65000,  52000,  90,  'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop', 1, 'DENIM', 'ACTIVE', 480, 120, false, NOW(), NOW()),
('오버사이즈 체크 코트',      '트렌디한 오버사이즈 체크 패턴 코트. 가을/겨울 필수.',              189000, 149000, 20,  'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=400&fit=crop', 1, 'COAT',  'ACTIVE', 650, 32,  true,  NOW(), NOW()),
('베이직 스트라이프 티',      '캐주얼하게 입기 좋은 스트라이프 반팔 티셔츠.',                     22000,  NULL,   180, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop', 1, 'BASIC', 'ACTIVE', 320, 95,  false, NOW(), NOW()),
('플리츠 미디 스커트',        '우아한 플리츠 디자인의 미디 스커트. 오피스룩에 완벽.',              48000,  38000,  55,  'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=400&fit=crop', 1, 'SKIRT', 'ACTIVE', 270, 58,  false, NOW(), NOW()),
('캐주얼 조거 팬츠',          '편안한 착용감의 조거 팬츠. 홈웨어와 캐주얼 모두 OK.',              35000,  28000,  120, 'https://images.unsplash.com/photo-1594938298603-c8148c4b4d3a?w=400&h=400&fit=crop', 1, 'PANTS', 'ACTIVE', 380, 102, false, NOW(), NOW()),
('리넨 블레이저',             '시원하고 세련된 리넨 소재 블레이저. 여름 오피스룩에 최적.',         89000,  72000,  30,  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=400&fit=crop', 1, 'BLAZER','ACTIVE', 420, 65,  false, NOW(), NOW()),
('롱 플로럴 원피스',          '화사한 플로럴 패턴의 롱 원피스. 봄/여름 필수 아이템.',             75000,  58000,  40,  'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop', 1, 'DRESS', 'ACTIVE', 510, 78,  true,  NOW(), NOW()),
('캐주얼 스니커즈 화이트',    '데일리로 신기 좋은 캐주얼 스니커즈.',                              55000,  42000,  100, 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop', 1, 'SHOES', 'ACTIVE', 620, 155, false, NOW(), NOW()),
('울 혼방 머플러',            '따뜻하고 부드러운 울 혼방 머플러. 다양한 색상.',                   35000,  NULL,   80,  'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=400&fit=crop', 1, 'ACC',   'ACTIVE', 190, 45,  false, NOW(), NOW()),
('데님 오버롤',               '트렌디한 데님 오버롤. 캐주얼하고 편안한 착용감.',                  72000,  58000,  35,  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop', 1, 'DENIM', 'ACTIVE', 280, 42,  false, NOW(), NOW()),
('크롭 후드 집업',            '트렌디한 크롭 기장의 후드 집업. 하이웨이스트 팬츠와 매칭.',         55000,  42000,  60,  'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=400&fit=crop', 1, 'HOOD',  'ACTIVE', 340, 72,  false, NOW(), NOW()),
('빈티지 워싱 데님',          '자연스러운 빈티지 워싱 처리된 데님 팬츠.',                         68000,  NULL,   45,  'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop', 1, 'DENIM', 'ACTIVE', 310, 68,  false, NOW(), NOW()),
('캐시미어 터치 니트',        '캐시미어처럼 부드러운 프리미엄 니트. 세련된 컬러.',                 89000,  72000,  30,  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop', 1, 'KNIT',  'ACTIVE', 260, 48,  false, NOW(), NOW()),
('숄더백 미디엄',             '실용적인 미디엄 사이즈 숄더백. 다양한 코디에 활용.',                95000,  78000,  20,  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop', 1, 'BAG',   'ACTIVE', 450, 55,  false, NOW(), NOW());

-- ============================================================
-- 전자제품 (category_id=2) - 20개
-- ============================================================
INSERT IGNORE INTO products (name, description, price, discount_price, stock, thumbnail_url, category_id, brand, status, view_count, sales_count, featured, created_at, updated_at) VALUES
('초경량 노트북 15인치',          '1kg 미만의 초경량 고성능 노트북. Intel i7, 16GB RAM.',           1500000, 1350000, 20,  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop', 2, 'TechBook',   'ACTIVE', 1200, 45,  true,  NOW(), NOW()),
('노이즈캔슬링 무선 이어폰',      '완벽한 몰입감. ANC 기술 적용 프리미엄 무선 이어폰.',             250000,  199000,  100, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', 2, 'SoundPro',   'ACTIVE', 1800, 320, true,  NOW(), NOW()),
('스마트워치 프로 S2',            '건강 관리 올인원. 혈압/혈당 측정, GPS 내장.',                    350000,  299000,  50,  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', 2, 'WatchPro',   'ACTIVE', 950, 88,  false, NOW(), NOW()),
('4K UHD 스마트 TV 65형',         '생생한 4K 화질. 넷플릭스/유튜브 내장 스마트 TV.',                1200000, 990000,  15,  'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400&h=400&fit=crop', 2, 'ScreenMax',  'ACTIVE', 1500, 18,  true,  NOW(), NOW()),
('고속 무선 충전기 3in1',         '스마트폰+워치+이어폰 동시 충전. 최대 15W 고속 충전.',            45000,   35000,   200, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop', 2, 'ChargePad',  'ACTIVE', 680, 185, false, NOW(), NOW()),
('기계식 키보드 청축 TKL',        '타건감 최고. 텐키리스 기계식 키보드. RGB 백라이트.',              120000,  89000,   40,  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop', 2, 'KeyMaster',  'ACTIVE', 580, 62,  false, NOW(), NOW()),
('무선 게이밍 마우스 Pro',        '1ms 응답속도. 초경량 무선 게이밍 마우스.',                       85000,   NULL,    60,  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop', 2, 'MousePro',   'ACTIVE', 420, 38,  false, NOW(), NOW()),
('포터블 블루투스 스피커 IPX7',   '방수 등급 IPX7. 야외에서도 강력한 사운드.',                      79000,   59000,   80,  'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', 2, 'SoundBox',   'ACTIVE', 520, 72,  false, NOW(), NOW()),
('27인치 QHD 게이밍 모니터',      '2560x1440 QHD, 165Hz. 게이머를 위한 최고의 모니터.',             350000,  299000,  25,  'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop', 2, 'ViewPro',    'ACTIVE', 780, 28,  false, NOW(), NOW()),
('대용량 보조배터리 30000mAh',    'PD 65W 고속 충전. 노트북도 충전 가능한 대용량.',                  59000,   45000,   150, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop', 2, 'PowerBank',  'ACTIVE', 920, 215, true,  NOW(), NOW()),
('미러리스 카메라 입문용',        '2420만 화소. 유튜버/브이로거를 위한 입문용 미러리스.',            650000,  550000,  15,  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop', 2, 'SnapPro',    'ACTIVE', 1100, 22, true,  NOW(), NOW()),
('태블릿 PC 11인치',              '2K 디스플레이, 키보드 커버 포함. 업무/학습에 최적.',              450000,  380000,  30,  'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop', 2, 'TabPro',     'ACTIVE', 850, 45,  false, NOW(), NOW()),
('공기청정기 360도 청정',         '헤파 필터. 미세먼지/바이러스 99.97% 제거.',                      280000,  230000,  35,  'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop', 2, 'AirPure',    'ACTIVE', 620, 55,  false, NOW(), NOW()),
('로봇청소기 레이저 매핑',        '레이저 매핑 + 자동 충전. 스마트폰으로 원격 제어.',               350000,  280000,  20,  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 2, 'CleanBot',   'ACTIVE', 980, 38,  true,  NOW(), NOW()),
('스마트 스피커 AI',              '인공지능 음성 비서. 스마트홈 허브 기능.',                         89000,   72000,   80,  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 2, 'SmartHub',   'ACTIVE', 450, 68,  false, NOW(), NOW()),
('USB-C 허브 8in1',               '8포트 올인원 허브. HDMI 4K, PD 100W 지원.',                      45000,   35000,   120, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 2, 'HubPro',     'ACTIVE', 380, 92,  false, NOW(), NOW()),
('게이밍 헤드셋 7.1채널',         '7.1 가상 서라운드. 노이즈캔슬링 마이크 내장.',                   89000,   72000,   45,  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', 2, 'SoundGame',  'ACTIVE', 520, 48,  false, NOW(), NOW()),
('스마트 체중계 BMI측정',         'BMI/체지방/근육량 측정. 앱 연동 스마트 체중계.',                  35000,   28000,   100, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 2, 'HealthScale','ACTIVE', 290, 75,  false, NOW(), NOW()),
('전동 킥보드 접이식',            '최대 25km/h, 30km 주행. 접이식 경량 전동 킥보드.',               450000,  380000,  10,  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 2, 'RideGo',     'ACTIVE', 1200, 15, true,  NOW(), NOW()),
('4K 액션캠 방수',                '4K 60fps 촬영. 방수 케이스 포함. 손떨림 보정.',                  180000,  148000,  25,  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop', 2, 'ActionCam',  'ACTIVE', 680, 32,  false, NOW(), NOW());

-- ============================================================
-- 뷰티/화장품 (category_id=3) - 8개
-- ============================================================
INSERT IGNORE INTO products (name, description, price, discount_price, stock, thumbnail_url, category_id, brand, status, view_count, sales_count, featured, created_at, updated_at) VALUES
('수분 진정 크림 50ml',          '민감성 피부를 위한 수분 진정 크림. 히알루론산 5중 복합체.',      32000, 25000, 100, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop', 3, 'SkinLab',   'ACTIVE', 680, 125, true,  NOW(), NOW()),
('비타민C 브라이트닝 세럼',      '피부 톤을 밝혀주는 고농축 비타민C 세럼. 20% 고함량.',           45000, 35000, 80,  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop', 3, 'GlowUp',    'ACTIVE', 520, 98,  false, NOW(), NOW()),
('무기자차 선크림 SPF50+',        '백탁 없는 순한 무기자차. 피부 자극 최소화.',                    28000, 19000, 150, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop', 3, 'SunGuard',  'ACTIVE', 890, 215, true,  NOW(), NOW()),
('퍼펙트 커버 쿠션',             '하루종일 무너짐 없는 커버력. SPF50+ PA++++.',                    38000, 28000, 90,  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 3, 'CoverFit',  'ACTIVE', 750, 168, true,  NOW(), NOW()),
('약산성 클렌징 폼',             '피부 장벽을 보호하는 pH 5.5 약산성 클렌징.',                    18000, 12000, 200, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop', 3, 'CleanPH',   'ACTIVE', 480, 112, false, NOW(), NOW()),
('레티놀 안티에이징 크림',       '주름 개선 레티놀 0.1% 함유. 탄력 있는 피부로.',                  55000, 42000, 60,  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop', 3, 'AgeLab',    'ACTIVE', 420, 88,  false, NOW(), NOW()),
('시트 마스크팩 10매 세트',      '1일 1팩을 위한 수분 마스크팩. 히알루론산 듬뿍.',                 20000, 10000, 300, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop', 3, 'MaskLab',   'ACTIVE', 1100, 320, true,  NOW(), NOW()),
('매트 립스틱 10컬러',           '발색력 좋은 매트 립스틱. 10가지 컬러 구성.',                     25000, NULL,  60,  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 3, 'LipPro',    'ACTIVE', 380, 72,  false, NOW(), NOW());

-- ============================================================
-- 식품/건강 (category_id=4) - 7개
-- ============================================================
INSERT IGNORE INTO products (name, description, price, discount_price, stock, thumbnail_url, category_id, brand, status, view_count, sales_count, featured, created_at, updated_at) VALUES
('프리미엄 홍삼 진액 30포',      '6년근 홍삼 100%. 면역력 증진에 도움.',                           120000, 89000, 30,  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop', 4, '홍삼원',   'ACTIVE', 620, 45,  true,  NOW(), NOW()),
('프로바이오틱스 유산균 60포',   '100억 마리 생유산균. 장 건강 개선.',                             45000, 35000, 100, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', 4, '유산균랩', 'ACTIVE', 480, 125, true,  NOW(), NOW()),
('닭가슴살 소시지 10팩',         '저칼로리 고단백. 다이어트 식단 필수품.',                          25000, 19900, 150, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop', 4, '헬스푸드', 'ACTIVE', 850, 285, true,  NOW(), NOW()),
('종합 비타민 미네랄 90정',      '하루 한 알로 채우는 13가지 비타민+미네랄.',                       45000, 35000, 80,  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', 4, '비타민랩', 'ACTIVE', 380, 92,  false, NOW(), NOW()),
('단백질 쉐이크 초코맛 1kg',     '맛있게 즐기는 WPC 단백질 보충제. 1회 25g 단백질.',               42000, 32000, 60,  'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop', 4, '프로틴랩', 'ACTIVE', 520, 115, false, NOW(), NOW()),
('유기농 현미 10kg',             '무농약 유기농 인증. 건강한 식탁을 위한 현미.',                    45000, 39000, 50,  'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&h=400&fit=crop', 4, '유기농팜', 'ACTIVE', 290, 48,  false, NOW(), NOW()),
('오메가3 피쉬오일 120캡슐',     '혈행 개선. EPA+DHA 1000mg 고함량.',                              30000, 22000, 90,  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', 4, '오메가랩', 'ACTIVE', 340, 78,  false, NOW(), NOW());

-- ============================================================
-- 스포츠/레저 (category_id=5) - 6개
-- ============================================================
INSERT IGNORE INTO products (name, description, price, discount_price, stock, thumbnail_url, category_id, brand, status, view_count, sales_count, featured, created_at, updated_at) VALUES
('요가 매트 TPE 6mm',            '친환경 TPE 소재. 미끄럼 방지 + 관절 보호.',                      35000, 25000, 100, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop', 5, 'YogaFit',   'ACTIVE', 520, 145, true,  NOW(), NOW()),
('초경량 캠핑 텐트 2인용',       '1.8kg 초경량. 백패킹에 최적화된 2인용 텐트.',                    150000, 120000, 20,  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=400&fit=crop', 5, 'CampPro',   'ACTIVE', 680, 28,  true,  NOW(), NOW()),
('홈트 덤벨 세트 2-20kg',        '무게 조절 가능. 공간 절약형 덤벨 세트.',                          85000, 65000, 30,  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop', 5, 'GymPro',    'ACTIVE', 450, 38,  false, NOW(), NOW()),
('자전거 헬멧 경량',             '안전 인증 CE. 초경량 250g 자전거 헬멧.',                          55000, 42000, 40,  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 5, 'SafeRide',  'ACTIVE', 320, 55,  false, NOW(), NOW()),
('등산화 방수 고어텍스',         '고어텍스 방수. 발목 보호 등산화.',                                120000, 95000, 35,  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', 5, 'HikePro',   'ACTIVE', 580, 72,  false, NOW(), NOW()),
('캠핑 침낭 -10도',              '영하 10도까지 사용 가능. 사계절 캠핑 침낭.',                      85000, 65000, 40,  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=400&fit=crop', 5, 'SleepOut',  'ACTIVE', 420, 48,  false, NOW(), NOW());

-- ============================================================
-- 가구/인테리어 (category_id=6) - 6개
-- ============================================================
INSERT IGNORE INTO products (name, description, price, discount_price, stock, thumbnail_url, category_id, brand, status, view_count, sales_count, featured, created_at, updated_at) VALUES
('인체공학 메쉬 의자',           '요추 지지대 + 팔걸이 높이 조절. 장시간 작업에 최적.',            180000, 149000, 30,  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', 6, 'ErgoChair', 'ACTIVE', 820, 48,  true,  NOW(), NOW()),
('원목 4인 식탁 세트',           '고무나무 원목. 식탁+의자 4개 세트.',                              350000, 290000, 15,  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', 6, 'WoodHome',  'ACTIVE', 720, 18,  true,  NOW(), NOW()),
('LED 스탠드 조명',              '밝기/색온도 조절. 눈 보호 LED 스탠드.',                           55000, 42000, 80,  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop', 6, 'LightArt',  'ACTIVE', 480, 88,  false, NOW(), NOW()),
('메모리폼 토퍼 퀸',             '7cm 고밀도 메모리폼. 수면의 질 향상.',                            120000, 89000, 40,  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', 6, 'SleepWell', 'ACTIVE', 650, 35,  true,  NOW(), NOW()),
('암막 커튼 2장',                '빛 차단율 99%. 방음 효과까지.',                                   55000, 39000, 80,  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 6, 'DarkRoom',  'ACTIVE', 380, 65,  false, NOW(), NOW()),
('극세사 러그 200x150',          '부드러운 촉감. 거실/침실용 대형 러그.',                           65000, 48000, 50,  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', 6, 'SoftRug',   'ACTIVE', 290, 42,  false, NOW(), NOW());

-- ============================================================
-- 도서/문구 (category_id=7) - 5개
-- ============================================================
INSERT IGNORE INTO products (name, description, price, discount_price, stock, thumbnail_url, category_id, brand, status, view_count, sales_count, featured, created_at, updated_at) VALUES
('2025 위클리 플래너',           '효율적인 일정 관리. 위클리+먼슬리 구성.',                         18000, 14400, 100, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop', 7, 'PlanPro',   'ACTIVE', 420, 115, true,  NOW(), NOW()),
('베스트셀러 소설 3권 세트',     '2024년 가장 사랑받은 소설 3권 세트.',                             45000, 40500, 60,  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop', 7, '문학사',    'ACTIVE', 580, 88,  true,  NOW(), NOW()),
('프리미엄 만년필 세트',         '부드러운 필기감. 잉크 카트리지 10개 포함.',                       55000, 42000, 40,  'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&h=400&fit=crop', 7, 'PenArt',    'ACTIVE', 280, 38,  false, NOW(), NOW()),
('파스텔 형광펜 12색',           '눈이 편안한 파스텔 톤. 12가지 색상.',                             12000,  9000, 200, 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&h=400&fit=crop', 7, 'ColorPen',  'ACTIVE', 350, 125, false, NOW(), NOW()),
('독서대 각도조절',              '7단계 각도 조절. 책/태블릿 모두 사용 가능.',                      25000, 19000, 80,  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop', 7, 'ReadStand', 'ACTIVE', 310, 68,  false, NOW(), NOW());

-- ============================================================
-- 유아/아동 (category_id=8) - 5개
-- ============================================================
INSERT IGNORE INTO products (name, description, price, discount_price, stock, thumbnail_url, category_id, brand, status, view_count, sales_count, featured, created_at, updated_at) VALUES
('유기농 순면 아기 내복 세트',   '피부 자극 없는 유기농 순면. 신생아~24개월.',                      35000, 25000, 100, 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=400&fit=crop', 8, 'BabyPure',  'ACTIVE', 520, 88,  true,  NOW(), NOW()),
('아동용 킥보드 LED',            '안전한 3륜 LED 발광 킥보드. 3~8세 적합.',                         55000, 45000, 40,  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 8, 'KidRide',   'ACTIVE', 620, 78,  true,  NOW(), NOW()),
('친환경 원목 블록 100피스',     '무독성 원목. 창의력 발달 교구.',                                  45000, 35000, 50,  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 8, 'WoodPlay',  'ACTIVE', 380, 55,  false, NOW(), NOW()),
('아기 물티슈 10팩',             '도톰하고 부드러운 엠보싱 물티슈. 무향.',                          22000, 15000, 200, 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=400&fit=crop', 8, 'BabyWipe',  'ACTIVE', 720, 215, false, NOW(), NOW()),
('유아용 실리콘 식기 세트',      '환경호르몬 없는 실리콘. 식판+그릇+숟가락 세트.',                  32000, 25000, 80,  'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=400&fit=crop', 8, 'BabyEat',   'ACTIVE', 290, 65,  false, NOW(), NOW());

-- ============================================================
-- 반려동물 (category_id=9) - 5개
-- ============================================================
INSERT IGNORE INTO products (name, description, price, discount_price, stock, thumbnail_url, category_id, brand, status, view_count, sales_count, featured, created_at, updated_at) VALUES
('프리미엄 강아지 사료 5kg',     '그레인프리. 관절/피부 건강에 좋은 연어 사료.',                    55000, 45000, 60,  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop', 9, 'PetFeed',   'ACTIVE', 680, 95,  true,  NOW(), NOW()),
('반려동물 자동 급식기',         '스마트폰 제어. 예약 급식 + 카메라 내장.',                         85000, 69000, 30,  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop', 9, 'AutoFeed',  'ACTIVE', 820, 38,  true,  NOW(), NOW()),
('고양이 캣타워 5단',            '튼튼한 원목 스크래쳐. 5단 구성.',                                 120000, 89000, 20,  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop', 9, 'CatTower',  'ACTIVE', 720, 28,  false, NOW(), NOW()),
('강아지 배변패드 100매',        '흡수력 좋은 두꺼운 배변패드. 냄새 차단.',                         18000, 13000, 200, 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop', 9, 'PetPad',    'ACTIVE', 580, 185, false, NOW(), NOW()),
('고양이 츄르 간식 40개입',      '기호성 최고. 참치+닭고기 혼합.',                                  25000, 19000, 150, 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop', 9, 'CatSnack',  'ACTIVE', 650, 225, false, NOW(), NOW());

-- ============================================================
-- 자동차용품 (category_id=10) - 5개
-- ============================================================
INSERT IGNORE INTO products (name, description, price, discount_price, stock, thumbnail_url, category_id, brand, status, view_count, sales_count, featured, created_at, updated_at) VALUES
('고속 무선 충전 거치대',        '자동 열림/닫힘. 15W 고속 무선 충전.',                             45000, 35000, 80,  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 10, 'CarCharge', 'ACTIVE', 720, 135, true,  NOW(), NOW()),
('차량용 공기청정기',            '헤파 필터. 미세먼지/바이러스 제거.',                               65000, 49000, 30,  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 10, 'AirCar',    'ACTIVE', 420, 55,  false, NOW(), NOW()),
('세차용품 7종 세트',            '셀프 세차 완벽 세트. 거품건+타올+왁스 등.',                       48000, 38000, 40,  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 10, 'WashPro',   'ACTIVE', 380, 38,  false, NOW(), NOW()),
('블랙박스 2채널 4K',            '전후방 4K 녹화. 주차 감시 모드.',                                 180000, 148000, 25, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 10, 'DashCam',   'ACTIVE', 850, 48,  true,  NOW(), NOW()),
('타이어 공기압 주입기',         '무선 스마트 에어펌프. 자동 압력 설정.',                            55000, 45000, 40,  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 10, 'AirPump',   'ACTIVE', 320, 42,  false, NOW(), NOW());
