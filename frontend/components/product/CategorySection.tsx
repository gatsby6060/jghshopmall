import Link from 'next/link';

const categories = [
  { id: 1, name: '패션/의류', icon: '👗', color: 'bg-pink-50 hover:bg-pink-100' },
  { id: 2, name: '전자제품', icon: '💻', color: 'bg-blue-50 hover:bg-blue-100' },
  { id: 3, name: '뷰티/화장품', icon: '💄', color: 'bg-rose-50 hover:bg-rose-100' },
  { id: 4, name: '식품/건강', icon: '🥗', color: 'bg-green-50 hover:bg-green-100' },
  { id: 5, name: '스포츠/레저', icon: '⚽', color: 'bg-orange-50 hover:bg-orange-100' },
  { id: 6, name: '가구/인테리어', icon: '🛋️', color: 'bg-amber-50 hover:bg-amber-100' },
  { id: 7, name: '도서/문구', icon: '📚', color: 'bg-purple-50 hover:bg-purple-100' },
  { id: 8, name: '유아/아동', icon: '🧸', color: 'bg-yellow-50 hover:bg-yellow-100' },
  { id: 9, name: '반려동물', icon: '🐾', color: 'bg-teal-50 hover:bg-teal-100' },
  { id: 10, name: '자동차용품', icon: '🚗', color: 'bg-gray-50 hover:bg-gray-100' },
];

export default function CategorySection() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">카테고리</h2>
      <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.id}`}
            className={`${cat.color} rounded-xl p-4 flex flex-col items-center gap-2 transition cursor-pointer`}
          >
            <span className="text-3xl">{cat.icon}</span>
            <span className="text-xs font-medium text-gray-700 text-center leading-tight">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
