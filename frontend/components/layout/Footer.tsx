import Link from 'next/link';
import KakaoMap from '@/components/map/KakaoMap';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 회사 정보 */}
          <div className="md:col-span-2">
            <h3 className="text-white text-xl font-bold mb-4">ShopMall</h3>
            <p className="text-sm leading-relaxed mb-4 whitespace-pre-line">{t('tagline')}</p>
            <div className="text-sm space-y-1">
              <p>{t('company')}: (주)쇼핑몰</p>
              <p>{t('ceo')}: 홍길동</p>
              <p>{t('bizNumber')}: 123-45-67890</p>
              <p>{t('mailOrder')}: 제2024-서울강남-12345호</p>
              <p>{t('address')}: 서울특별시 강남구 테헤란로 123, 쇼핑몰빌딩 10층</p>
              <p>
                {t('cs')}: 1588-1234{' '}
                <span className="text-gray-400">{t('csHours')}</span>
              </p>
              <p>{t('email')}: support@shopmall.com</p>
            </div>
          </div>

          {/* 고객 서비스 */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('customerService')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white" prefetch={false}>
                  {t('links.about')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white" prefetch={false}>
                  {t('links.faq')}
                </Link>
              </li>
              <li>
                <Link href="/notice" className="hover:text-white" prefetch={false}>
                  {t('links.notice')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white" prefetch={false}>
                  {t('links.contact')}
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white" prefetch={false}>
                  {t('links.returns')}
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white" prefetch={false}>
                  {t('links.shipping')}
                </Link>
              </li>
            </ul>
          </div>

          {/* 이용 안내 */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('guide')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:text-white" prefetch={false}>
                  {t('guideLinks.terms')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white" prefetch={false}>
                  {t('guideLinks.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/mypage" className="hover:text-white">
                  {t('guideLinks.mypage')}
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white" prefetch={false}>
                  {t('guideLinks.orders')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 지도 섹션 */}
        <div className="mt-10 border-t border-gray-700 pt-8">
          <h4 className="text-white font-semibold mb-4">{t('directions')}</h4>
          <div className="rounded-lg overflow-hidden">
            <KakaoMap />
          </div>
        </div>

        {/* 저작권 */}
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
