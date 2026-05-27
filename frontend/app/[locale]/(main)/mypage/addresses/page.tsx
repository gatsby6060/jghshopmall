'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import {
  MapPin, Plus, Star, Pencil, Trash2, Check, X, ChevronLeft, Home, Building2
} from 'lucide-react';
import toast from 'react-hot-toast';
import Script from 'next/script';


interface Address {
  id: number;
  alias: string;
  receiverName: string;
  receiverPhone: string;
  zipCode: string;
  address: string;
  addressDetail: string | null;
  isDefault: boolean;
}

interface AddressForm {
  alias: string;
  receiverName: string;
  receiverPhone: string;
  zipCode: string;
  address: string;
  addressDetail: string;
  isDefault: boolean;
}

const emptyForm: AddressForm = {
  alias: '',
  receiverName: '',
  receiverPhone: '',
  zipCode: '',
  address: '',
  addressDetail: '',
  isDefault: false,
};

const formatPhone = (v: string) => {
  const n = v.replace(/[^\d]/g, '');
  if (n.startsWith('02')) {
    if (n.length <= 5) return n.replace(/(\d{2})(\d+)/, '$1-$2');
    if (n.length <= 9) return n.replace(/(\d{2})(\d{3})(\d+)/, '$1-$2-$3');
    return n.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
  }
  if (n.length <= 6) return n.replace(/(\d{3})(\d+)/, '$1-$2');
  if (n.length <= 10) return n.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
  return n.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
};

export default function AddressesPage() {
  const router = useRouter();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AddressForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<AddressForm>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) router.push(`/${locale}/login`);
  }, [isAuthenticated, router, locale]);

  const { data, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => addressApi.getAddresses(),
    enabled: isAuthenticated,
  });

  const addresses: Address[] = data?.data?.data ?? [];

  const addMutation = useMutation({
    mutationFn: (d: AddressForm) => addressApi.addAddress({ ...d }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('배송지가 추가되었습니다!');
      resetForm();
    },
    onError: (e: { response?: { data?: { message?: string } } }) => {
      toast.error(e.response?.data?.message || '배송지 추가에 실패했습니다.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: AddressForm }) =>
      addressApi.updateAddress(id, { ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('배송지가 수정되었습니다!');
      resetForm();
    },
    onError: (e: { response?: { data?: { message?: string } } }) => {
      toast.error(e.response?.data?.message || '배송지 수정에 실패했습니다.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => addressApi.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('배송지가 삭제되었습니다.');
      setDeleteConfirmId(null);
    },
    onError: () => toast.error('배송지 삭제에 실패했습니다.'),
  });

  const setDefaultMutation = useMutation({
    mutationFn: (id: number) => addressApi.setDefaultAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('기본 배송지가 변경되었습니다!');
    },
    onError: () => toast.error('기본 배송지 변경에 실패했습니다.'),
  });

  const validate = (): boolean => {
    const newErrors: Partial<AddressForm> = {};
    if (!form.alias.trim()) newErrors.alias = '별칭을 입력해주세요.';
    if (!form.receiverName.trim()) newErrors.receiverName = '수령인 이름을 입력해주세요.';
    if (!form.receiverPhone.trim()) newErrors.receiverPhone = '전화번호를 입력해주세요.';
    if (!form.zipCode.trim()) newErrors.zipCode = '우편번호를 입력해주세요.';
    if (!form.address.trim()) newErrors.address = '주소를 입력해주세요.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingId !== null) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      addMutation.mutate(form);
    }
  };

  const handleEdit = (addr: Address) => {
    setForm({
      alias: addr.alias,
      receiverName: addr.receiverName,
      receiverPhone: addr.receiverPhone,
      zipCode: addr.zipCode,
      address: addr.address,
      addressDetail: addr.addressDetail ?? '',
      isDefault: addr.isDefault,
    });
    setEditingId(addr.id);
    setShowForm(true);
    setErrors({});
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setErrors({});
  };

  const handleAddressSearch = () => {
    if (typeof window !== 'undefined' && window.daum) {
      new window.daum.Postcode({
        oncomplete: (data) => {
          let full = data.address;
          if (data.userSelectedType === 'R') {
            const extra = [data.bname, data.buildingName].filter(Boolean).join(', ');
            if (extra) full += ` (${extra})`;
          }
          setForm(prev => ({ ...prev, zipCode: data.zonecode, address: full }));
          setErrors(prev => ({ ...prev, zipCode: undefined, address: undefined }));
        },
      }).open();
    } else {
      toast.error('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const isMutating = addMutation.isPending || updateMutation.isPending;

  return (
    <>
      <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" strategy="lazyOnload" />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.push(`/${locale}/mypage`)}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition"
          >
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">배송지 관리</h1>
            <p className="text-sm text-gray-400 mt-0.5">자주 쓰는 배송지를 최대 10개까지 저장할 수 있습니다.</p>
          </div>
          <div className="ml-auto">
            {!showForm && (
              <button
                onClick={() => { resetForm(); setShowForm(true); }}
                disabled={addresses.length >= 10}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition shadow-sm"
              >
                <Plus size={16} />
                새 배송지 추가
              </button>
            )}
          </div>
        </div>

        {/* 배송지 추가/수정 폼 */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-6 mb-6 ring-2 ring-indigo-50">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? '배송지 수정' : '새 배송지 추가'}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-700 transition">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 별칭 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">별칭 <span className="text-red-500">*</span></label>
                <div className="flex gap-2 mb-1">
                  {['집', '회사', '학교'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, alias: tag }))}
                      className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition ${form.alias === tag ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-300'}`}
                    >
                      {tag === '집' ? <span className="flex items-center gap-1"><Home size={11}/>{tag}</span>
                        : tag === '회사' ? <span className="flex items-center gap-1"><Building2 size={11}/>{tag}</span>
                        : tag}
                    </button>
                  ))}
                </div>
                <input
                  value={form.alias}
                  onChange={e => setForm(p => ({ ...p, alias: e.target.value }))}
                  placeholder="예: 집, 회사, 부모님댁"
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.alias ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.alias && <p className="text-red-500 text-xs mt-1">{errors.alias}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 수령인 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">수령인 이름 <span className="text-red-500">*</span></label>
                  <input
                    value={form.receiverName}
                    onChange={e => setForm(p => ({ ...p, receiverName: e.target.value }))}
                    placeholder="홍길동"
                    className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.receiverName ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.receiverName && <p className="text-red-500 text-xs mt-1">{errors.receiverName}</p>}
                </div>

                {/* 전화번호 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">전화번호 <span className="text-red-500">*</span></label>
                  <input
                    value={form.receiverPhone}
                    onChange={e => setForm(p => ({ ...p, receiverPhone: formatPhone(e.target.value) }))}
                    placeholder="010-1234-5678"
                    maxLength={13}
                    className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.receiverPhone ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.receiverPhone && <p className="text-red-500 text-xs mt-1">{errors.receiverPhone}</p>}
                </div>
              </div>

              {/* 우편번호 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">주소 <span className="text-red-500">*</span></label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={form.zipCode}
                    readOnly
                    onClick={handleAddressSearch}
                    placeholder="우편번호"
                    className={`flex-none w-32 border rounded-xl px-3 py-2.5 text-sm bg-gray-50 cursor-pointer focus:outline-none ${errors.zipCode ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  <button
                    type="button"
                    onClick={handleAddressSearch}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold rounded-xl px-4 py-2.5 transition"
                  >
                    주소 검색
                  </button>
                </div>
                <input
                  value={form.address}
                  readOnly
                  onClick={handleAddressSearch}
                  placeholder="주소 검색 버튼을 눌러 주소를 입력해주세요"
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-gray-50 cursor-pointer focus:outline-none mb-2 ${errors.address ? 'border-red-400' : 'border-gray-200'}`}
                />
                <input
                  value={form.addressDetail}
                  onChange={e => setForm(p => ({ ...p, addressDetail: e.target.value }))}
                  placeholder="상세 주소 (동/호수 등)"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                {(errors.zipCode || errors.address) && (
                  <p className="text-red-500 text-xs mt-1">주소를 입력해주세요.</p>
                )}
              </div>

              {/* 기본 배송지 */}
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  onClick={() => setForm(p => ({ ...p, isDefault: !p.isDefault }))}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition ${form.isDefault ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 group-hover:border-indigo-400'}`}
                >
                  {form.isDefault && <Check size={12} className="text-white" strokeWidth={3} />}
                </div>
                <span className="text-sm font-semibold text-gray-700">기본 배송지로 설정</span>
              </label>

              {/* 버튼 */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isMutating}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition disabled:opacity-60"
                >
                  {isMutating ? '저장 중...' : editingId ? '수정 완료' : '추가 완료'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 배송지 목록 */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
            <MapPin size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-semibold text-lg mb-1">등록된 배송지가 없습니다</p>
            <p className="text-gray-400 text-sm">위의 &apos;새 배송지 추가&apos; 버튼을 눌러 첫 배송지를 등록해 보세요!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`bg-white rounded-2xl p-5 shadow-sm border transition group ${addr.isDefault ? 'border-indigo-300 ring-2 ring-indigo-50' : 'border-gray-100 hover:border-gray-200'}`}
              >
                {/* 삭제 확인 모달 */}
                {deleteConfirmId === addr.id && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl flex flex-col gap-3">
                    <p className="text-sm font-semibold text-red-700">
                      &apos;{addr.alias}&apos; 배송지를 삭제하시겠습니까?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => deleteMutation.mutate(addr.id)}
                        disabled={deleteMutation.isPending}
                        className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg transition"
                      >
                        {deleteMutation.isPending ? '삭제 중...' : '삭제'}
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 ${addr.isDefault ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                      <MapPin size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-900">{addr.alias}</span>
                        {addr.isDefault && (
                          <span className="text-[11px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <Star size={9} fill="white" /> 기본
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-gray-700 mt-0.5">
                        {addr.receiverName} · {addr.receiverPhone}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5 truncate">
                        [{addr.zipCode}] {addr.address}
                        {addr.addressDetail && ` ${addr.addressDetail}`}
                      </p>
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {!addr.isDefault && (
                      <button
                        onClick={() => setDefaultMutation.mutate(addr.id)}
                        disabled={setDefaultMutation.isPending}
                        title="기본 배송지로 설정"
                        className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition text-xs font-semibold"
                      >
                        <Star size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(addr)}
                      title="수정"
                      className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(deleteConfirmId === addr.id ? null : addr.id)}
                      title="삭제"
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 개수 카운터 */}
        {addresses.length > 0 && (
          <p className="text-center text-xs text-gray-400 mt-6 font-medium">
            {addresses.length} / 10개 등록됨
            {addresses.length >= 10 && <span className="text-red-400 ml-2">· 최대 개수에 도달했습니다.</span>}
          </p>
        )}
      </div>
    </>
  );
}
