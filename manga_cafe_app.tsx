import React, { useState, useEffect } from 'react';
import { Users, Grid3x3, Archive, Plus, DollarSign, Clock, X } from 'lucide-react';

const MangaCafeApp = () => {
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [lockers, setLockers] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddUser, setShowAddUser] = useState(false);

  useEffect(() => {
    const initialRooms = Array.from({ length: 25 }, (_, i) => ({
      id: `R${String(i + 1).padStart(3, '0')}`,
      status: '비어있음',
      userId: null
    }));

    const initialLockers = Array.from({ length: 30 }, (_, i) => ({
      id: `L${String(i + 1).padStart(3, '0')}`,
      status: '비어있음',
      userId: null
    }));

    setRooms(initialRooms);
    setLockers(initialLockers);
  }, []);

  const addUser = (userData) => {
    const newUser = {
      id: `U${String(users.length + 1).padStart(3, '0')}`,
      name: userData.name,
      roomId: userData.roomId,
      lockerId: userData.lockerId,
      startTime: new Date().toLocaleString('ko-KR'),
      endTime: null,
      plan: userData.plan,
      paymentStatus: '미결제',
      fee: getFee(userData.plan)
    };

    setUsers([...users, newUser]);

    setRooms(rooms.map(room => 
      room.id === userData.roomId 
        ? { ...room, status: '사용중', userId: newUser.id }
        : room
    ));

    setLockers(lockers.map(locker =>
      locker.id === userData.lockerId
        ? { ...locker, status: '사용중', userId: newUser.id }
        : locker
    ));

    setShowAddUser(false);
  };

  const completePayment = (userId) => {
    const user = users.find(u => u.id === userId);
    
    setUsers(users.map(u =>
      u.id === userId
        ? { ...u, paymentStatus: '결제완료', endTime: new Date().toLocaleString('ko-KR') }
        : u
    ));

    setRooms(rooms.map(room =>
      room.id === user.roomId
        ? { ...room, status: '비어있음', userId: null }
        : room
    ));

    setLockers(lockers.map(locker =>
      locker.id === user.lockerId
        ? { ...locker, status: '비어있음', userId: null }
        : locker
    ));
  };

  const getFee = (plan) => {
    const fees = {
      '일반': 5000,
      'VIP': 10000,
      'VVIP': 15000,
      'VVVIP': 20000
    };
    return fees[plan] || 0;
  };

  const activeUsers = users.filter(u => u.paymentStatus === '미결제');
  const completedUsers = users.filter(u => u.paymentStatus === '결제완료');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-indigo-600 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold">만화카페 관리 시스템</h1>
        <p className="text-indigo-200 text-sm">실시간 방/신발장 관리</p>
      </div>

      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition ${
              activeTab === 'dashboard'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Grid3x3 size={20} />
            대시보드
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition ${
              activeTab === 'users'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users size={20} />
            손님 관리
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition ${
              activeTab === 'rooms'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Grid3x3 size={20} />
            방 현황
          </button>
          <button
            onClick={() => setActiveTab('lockers')}
            className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition ${
              activeTab === 'lockers'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Archive size={20} />
            신발장
          </button>
        </div>
      </div>

      <div className="p-4 max-w-7xl mx-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-gray-500 text-sm">현재 손님</div>
                <div className="text-3xl font-bold text-indigo-600">{activeUsers.length}</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-gray-500 text-sm">사용 중인 방</div>
                <div className="text-3xl font-bold text-green-600">
                  {rooms.filter(r => r.status === '사용중').length}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-gray-500 text-sm">비어있는 방</div>
                <div className="text-3xl font-bold text-gray-600">
                  {rooms.filter(r => r.status === '비어있음').length}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-gray-500 text-sm">오늘 총 매출</div>
                <div className="text-3xl font-bold text-blue-600">
                  {completedUsers.reduce((sum, u) => sum + u.fee, 0).toLocaleString()}원
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">현재 사용 중인 손님</h2>
              {activeUsers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">현재 사용 중인 손님이 없습니다</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeUsers.map(user => (
                    <div key={user.id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-bold text-lg">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.id}</div>
                        </div>
                        <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                          {user.plan}
                        </span>
                      </div>
                      <div className="text-sm space-y-1 mb-3">
                        <div className="flex items-center gap-2">
                          <Grid3x3 size={14} className="text-gray-400" />
                          <span>방: {user.roomId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Archive size={14} className="text-gray-400" />
                          <span>신발장: {user.lockerId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-gray-400" />
                          <span>{user.startTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign size={14} className="text-gray-400" />
                          <span className="font-bold text-green-600">{user.fee.toLocaleString()}원</span>
                        </div>
                      </div>
                      <button
                        onClick={() => completePayment(user.id)}
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                      >
                        결제 완료
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">손님 관리</h2>
              <button
                onClick={() => setShowAddUser(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                <Plus size={20} />
                신규 손님 등록
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-4">미결제 손님</h3>
              {activeUsers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">현재 사용 중인 손님이 없습니다</p>
              ) : (
                <div className="space-y-3">
                  {activeUsers.map(user => (
                    <div key={user.id} className="border rounded-lg p-4 flex justify-between items-center">
                      <div className="flex-1">
                        <div className="font-bold">{user.name} ({user.id})</div>
                        <div className="text-sm text-gray-600">
                          방: {user.roomId} | 신발장: {user.lockerId} | {user.plan} | {user.fee.toLocaleString()}원
                        </div>
                        <div className="text-xs text-gray-500">입장: {user.startTime}</div>
                      </div>
                      <button
                        onClick={() => completePayment(user.id)}
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                      >
                        결제 완료
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {completedUsers.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold mb-4">결제 완료 ({completedUsers.length}명)</h3>
                <div className="space-y-2">
                  {completedUsers.map(user => (
                    <div key={user.id} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex justify-between">
                        <div>
                          <span className="font-medium">{user.name}</span>
                          <span className="text-sm text-gray-500 ml-2">{user.plan}</span>
                        </div>
                        <span className="text-green-600 font-bold">{user.fee.toLocaleString()}원</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {user.startTime} ~ {user.endTime}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">방 현황 (25개)</h2>
            <div className="grid grid-cols-5 gap-3">
              {rooms.map(room => {
                const user = users.find(u => u.id === room.userId);
                return (
                  <div
                    key={room.id}
                    className={`p-4 rounded-lg border-2 transition ${
                      room.status === '사용중'
                        ? 'bg-red-50 border-red-300'
                        : 'bg-green-50 border-green-300'
                    }`}
                  >
                    <div className="font-bold text-center">{room.id}</div>
                    <div className={`text-xs text-center mt-1 ${
                      room.status === '사용중' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {room.status}
                    </div>
                    {user && (
                      <div className="text-xs text-center mt-1 text-gray-600">
                        {user.name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'lockers' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">신발장 현황 (30개)</h2>
            <div className="grid grid-cols-6 gap-3">
              {lockers.map(locker => {
                const user = users.find(u => u.id === locker.userId);
                return (
                  <div
                    key={locker.id}
                    className={`p-3 rounded-lg border-2 transition ${
                      locker.status === '사용중'
                        ? 'bg-red-50 border-red-300'
                        : 'bg-green-50 border-green-300'
                    }`}
                  >
                    <div className="font-bold text-center text-sm">{locker.id}</div>
                    <div className={`text-xs text-center mt-1 ${
                      locker.status === '사용중' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {locker.status}
                    </div>
                    {user && (
                      <div className="text-xs text-center mt-1 text-gray-600">
                        {user.name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">신규 손님 등록</h3>
              <button
                onClick={() => setShowAddUser(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <AddUserForm
              rooms={rooms.filter(r => r.status === '비어있음')}
              lockers={lockers.filter(l => l.status === '비어있음')}
              onSubmit={addUser}
              onCancel={() => setShowAddUser(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const AddUserForm = ({ rooms, lockers, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    roomId: '',
    lockerId: '',
    plan: '일반'
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.roomId || !formData.lockerId) {
      alert('모든 항목을 입력해주세요');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">손님 이름 *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="이름을 입력하세요"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">방 선택 *</label>
        <select
          value={formData.roomId}
          onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="">방을 선택하세요</option>
          {rooms.map(room => (
            <option key={room.id} value={room.id}>{room.id}</option>
          ))}
        </select>
        <div className="text-xs text-gray-500 mt-1">
          비어있는 방: {rooms.length}개
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">신발장 선택 *</label>
        <select
          value={formData.lockerId}
          onChange={(e) => setFormData({ ...formData, lockerId: e.target.value })}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="">신발장을 선택하세요</option>
          {lockers.map(locker => (
            <option key={locker.id} value={locker.id}>{locker.id}</option>
          ))}
        </select>
        <div className="text-xs text-gray-500 mt-1">
          비어있는 신발장: {lockers.length}개
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">요금제 *</label>
        <select
          value={formData.plan}
          onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="일반">일반 (5,000원)</option>
          <option value="VIP">VIP (10,000원)</option>
          <option value="VVIP">VVIP (15,000원)</option>
          <option value="VVVIP">VVVIP (20,000원)</option>
        </select>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          등록
        </button>
      </div>
    </div>
  );
};

export default MangaCafeApp;