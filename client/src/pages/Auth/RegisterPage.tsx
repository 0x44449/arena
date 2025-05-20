import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: '',
    loginId: '',
    name: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert('유효한 이메일 주소를 입력하세요');
      return;
    }

    // await axios.post('/auth/register', {
    //   email: form.email,
    //   loginId: form.loginId,
    //   password: form.password,
    // });
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white shadow-xl rounded-xl p-8 space-y-6 border border-gray-100">
      <h2 className="text-2xl font-bold text-center">회원가입</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">로그인 ID</label>
          <input
            type="text"
            required
            value={form.loginId}
            onChange={e => setForm({ ...form, loginId: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">이메일</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">이름</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">비밀번호</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">비밀번호 확인</label>
          <input
            type="password"
            required
            value={form.confirmPassword}
            onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition"
        >
          회원가입
        </button>
      </form>
    </div>
  )
}