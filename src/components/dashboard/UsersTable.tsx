'use client';

import { useEffect, useState } from 'react';

type Profile = { id: string; full_name: string | null; role: string; created_at: string };
const ROLES = ['admin', 'editor', 'agent', 'user'];

export function UsersTable() {
  const [rows, setRows] = useState<Profile[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/users').then((r) => r.json()).then((j) => {
      if (j.error) setError(j.error);
      else setRows(j.data ?? []);
    });
  }, []);

  async function setRole(id: string, role: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, role } : r)));
    await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role }),
    });
  }

  return (
    <div>
      <header className="mb-7">
        <h1 className="text-[26px] font-bold">Users &amp; roles</h1>
        <p className="mt-1.5 text-sm text-muted">Admins manage everything; editors manage content; agents manage listings and leads.</p>
      </header>

      {error && <p className="mb-5 rounded-lg bg-cream p-4 text-[13.5px] text-gold">{error}</p>}

      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full min-w-[560px] border-collapse text-[13.5px]">
          <thead>
            <tr className="border-b border-line bg-surface2">
              <th className="px-4 py-3 text-start font-semibold text-muted">Name</th>
              <th className="px-4 py-3 text-start font-semibold text-muted">User id</th>
              <th className="px-4 py-3 text-start font-semibold text-muted">Role</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">{r.full_name || '—'}</td>
                <td className="px-4 py-3 font-mono text-[11.5px] text-muted">{r.id.slice(0, 8)}…</td>
                <td className="px-4 py-3">
                  <select value={r.role} onChange={(e) => setRole(r.id, e.target.value)} className="h-10 cursor-pointer rounded-[9px] border border-line bg-surface px-3 outline-none focus:border-brand">
                    {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={3} className="px-4 py-12 text-center text-muted">No users yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
