'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import {
  ShieldAlert,
  Globe,
  Clock,
  Ban,
  CheckCircle,
  Search,
  Activity,
  UserCheck,
  AlertTriangle
} from 'lucide-react';

interface AccessLog {
  id: number;
  ipAddress: string;
  uri: string;
  method: string;
  userAgent: string;
  timestamp: string;
  country: string;
}

interface BlockedIp {
  id: number;
  ipAddress: string;
  reason: string;
  blockedAt: string;
}

export default function AdminIpMonitoringPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'logs' | 'blacklist'>('logs');
  const [page, setPage] = useState(0);
  const [searchIp, setSearchIp] = useState('');
  
  // 수동 차단 폼 상태
  const [manualIp, setManualIp] = useState('');
  const [manualReason, setManualReason] = useState('');
  const [showBlockModal, setShowBlockModal] = useState(false);

  // 1. 접속 로그 조회
  const { data: logsData, isLoading: logsLoading } = useQuery({
    queryKey: ['admin', 'access-logs', page],
    queryFn: () => adminApi.getAccessLogs({ page, size: 20 }),
  });

  // 2. 차단된 IP 목록 조회
  const { data: blockedData, isLoading: blockedLoading } = useQuery({
    queryKey: ['admin', 'blocked-ips'],
    queryFn: () => adminApi.getBlockedIps(),
  });

  // 3. IP 차단 액션
  const blockMutation = useMutation({
    mutationFn: ({ ip, reason }: { ip: string; reason: string }) =>
      adminApi.blockIp(ip, reason),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'blocked-ips'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'access-logs'] });
      toast.success('해당 IP가 접속 차단되었습니다.');
      setShowBlockModal(false);
      setManualIp('');
      setManualReason('');
    },
    onError: () => toast.error('IP 차단 처리에 실패했습니다.'),
  });

  // 4. IP 차단 해제 액션
  const unblockMutation = useMutation({
    mutationFn: (id: number) => adminApi.unblockIp(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'blocked-ips'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'access-logs'] });
      toast.success('접속 차단이 해제되었습니다.');
    },
    onError: () => toast.error('차단 해제에 실패했습니다.'),
  });

  const logs: AccessLog[] = logsData?.data?.data?.content || [];
  const pageData = logsData?.data?.data;
  const blockedIps: BlockedIp[] = blockedData?.data?.data || [];

  // 검색 필터링
  const filteredLogs = logs.filter(log => 
    log.ipAddress.includes(searchIp) || log.country.toLowerCase().includes(searchIp.toLowerCase())
  );

  const filteredBlocked = blockedIps.filter(item => 
    item.ipAddress.includes(searchIp)
  );

  // 국가 배지 및 위험 표시
  const renderCountryBadge = (country: string) => {
    switch (country) {
      case 'China':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 animate-pulse border border-red-200">
            🇨🇳 China (위험)
          </span>
        );
      case 'United States':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
            🇺🇸 United States
          </span>
        );
      case 'South Korea':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-200">
            🇰🇷 South Korea
          </span>
        );
      case 'Local/Private':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-200">
            💻 Local/Private
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 border border-gray-200">
            ❔ Unknown
          </span>
        );
    }
  };

  const handleOpenBlockModal = (ip: string) => {
    setManualIp(ip);
    setManualReason('의심스러운 해외 IP 접속 감지');
    setShowBlockModal(true);
  };

  // 주요 지표 계산
  const chinaVisits = logs.filter(log => log.country === 'China').length;
  const totalLogsCount = pageData?.totalElements || logs.length;

  return (
    <div className="space-y-6">
      {/* 타이틀 및 상단 버튼 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="text-indigo-600" />
            보안 접속 IP 모니터링
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            홈페이지 및 API 서버에 유입되는 클라이언트 IP를 감시하고 악성 IP(해외/중국 등)를 차단합니다.
          </p>
        </div>
        <button
          onClick={() => { setManualIp(''); setManualReason(''); setShowBlockModal(true); }}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition flex items-center gap-2 shadow-sm"
        >
          <Ban size={16} />
          수동 IP 차단 등록
        </button>
      </div>

      {/* 실시간 지표 대시보드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">전체 누적 접속 로그</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">{totalLogsCount}건</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <AlertTriangle size={24} className={chinaVisits > 0 ? 'animate-bounce' : ''} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">의심스러운 IP 감지 (China)</p>
            <p className="text-2xl font-bold text-red-600 mt-0.5">{chinaVisits}건</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-slate-100 text-slate-700 rounded-lg">
            <Ban size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">활성화된 IP 차단 개수</p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">{blockedIps.length}개</p>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 및 검색 바 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center p-4 border-b border-gray-200 gap-4 bg-gray-50/50">
          {/* 탭 */}
          <div className="flex gap-2">
            <button
              onClick={() => { setActiveTab('logs'); setSearchIp(''); }}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                activeTab === 'logs'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              접속 로그 모니터링
            </button>
            <button
              onClick={() => { setActiveTab('blacklist'); setSearchIp(''); }}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition flex items-center gap-2 ${
                activeTab === 'blacklist'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              차단된 IP 목록 (블랙리스트)
              {blockedIps.length > 0 && (
                <span className="bg-white text-red-600 text-xs px-1.5 py-0.5 rounded-full font-bold">
                  {blockedIps.length}
                </span>
              )}
            </button>
          </div>

          {/* 검색 바 */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={activeTab === 'logs' ? "IP 또는 국가 검색..." : "차단된 IP 검색..."}
              value={searchIp}
              onChange={(e) => setSearchIp(e.target.value)}
              className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* 메인 데이터 테이블 */}
        <div className="overflow-x-auto">
          {activeTab === 'logs' ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">국가</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">IP 주소</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">요청 메서드 / 경로</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">User-Agent</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">접속 일시</th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logsLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="px-6 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      접속 로그가 존재하지 않습니다.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => {
                    const isIpBlocked = blockedIps.some(blocked => blocked.ipAddress === log.ipAddress);
                    return (
                      <tr key={log.id} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">{renderCountryBadge(log.country)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{log.ipAddress}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-0.5 text-xs font-bold rounded mr-2 ${
                            log.method === 'GET' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                          }`}>{log.method}</span>
                          <span className="text-gray-600 font-mono text-xs">{log.uri}</span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate" title={log.userAgent}>
                          {log.userAgent || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">
                          {dayjs(log.timestamp + 'Z').format('YYYY-MM-DD HH:mm:ss')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                          {isIpBlocked ? (
                            <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-1 rounded border border-red-100 flex items-center justify-center gap-1 w-20 mx-auto">
                              <Ban size={12} /> 차단됨
                            </span>
                          ) : (
                            <button
                              onClick={() => handleOpenBlockModal(log.ipAddress)}
                              className="text-xs text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 px-3 py-1 rounded-md font-semibold transition"
                            >
                              접속 차단
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">차단된 IP 주소</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">차단 사유</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">차단 일시</th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {blockedLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={4} className="px-6 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : filteredBlocked.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      차단된 IP 주소가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredBlocked.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600 flex items-center gap-2">
                        <Ban size={14} />
                        {item.ipAddress}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.reason || '관리자 강제 차단'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">
                        {dayjs(item.blockedAt + 'Z').format('YYYY-MM-DD HH:mm:ss')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                        <button
                          onClick={() => unblockMutation.mutate(item.id)}
                          className="text-xs text-green-600 hover:text-white hover:bg-green-600 border border-green-200 hover:border-green-600 px-3 py-1 rounded-md font-semibold transition"
                        >
                          차단 해제
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* 접속 로그 페이지네이션 */}
        {activeTab === 'logs' && pageData && pageData.totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-200 bg-gray-50/30">
            {Array.from({ length: pageData.totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-8 h-8 rounded-lg text-sm font-semibold transition ${
                  i === page ? 'bg-indigo-600 text-white shadow-sm' : 'border border-gray-300 hover:bg-gray-50 bg-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* IP 차단 모달 창 */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Ban className="text-red-600" />
              IP 접속 차단 추가
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">차단할 IP 주소</label>
                <input
                  type="text"
                  placeholder="예: 222.128.10.45"
                  value={manualIp}
                  onChange={(e) => setManualIp(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">차단 사유</label>
                <input
                  type="text"
                  placeholder="예: 중국 의심 대역, 악성 접근"
                  value={manualReason}
                  onChange={(e) => setManualReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowBlockModal(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-lg transition"
              >
                취소
              </button>
              <button
                onClick={() => {
                  if (!manualIp) {
                    toast.error('IP 주소를 입력해 주세요.');
                    return;
                  }
                  blockMutation.mutate({ ip: manualIp, reason: manualReason });
                }}
                disabled={blockMutation.isPending}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition disabled:bg-red-400 shadow-sm"
              >
                {blockMutation.isPending ? '처리 중...' : '접속 차단 등록'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
