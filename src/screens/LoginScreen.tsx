import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { authApi } from '../services/auth';

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [programStudi, setProgramStudi] = useState('');
  const [fakultas, setFakultas] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;
      if (isLogin) {
        response = await authApi.login({ email, password });
      } else {
        if (!name) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        response = await authApi.register({
          email,
          password,
          name,
          nim: nim || undefined,
          programStudi: programStudi || undefined,
          fakultas: fakultas || undefined,
        });
      }

      if (response.success) {
        navigate('/');
      } else {
        setError(response.error || 'Authentication failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell topBarTitle="VR Lab" showBottomNav={false}>
      <div className="pt-8 pb-6">
        <div className="max-w-md mx-auto">
          <Card>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                {isLogin ? 'Login' : 'Register'}
              </h2>
              <p className="text-text-secondary">
                {isLogin
                  ? 'Login to access VR Lab Booking Portal'
                  : 'Create an account to start booking'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 bg-bg-main border border-slate-600 rounded-lg text-text-primary focus:outline-none focus:border-indigo-500"
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-main border border-slate-600 rounded-lg text-text-primary focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-main border border-slate-600 rounded-lg text-text-primary focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      NIM / NIDN
                    </label>
                    <input
                      type="text"
                      value={nim}
                      onChange={(e) => setNim(e.target.value)}
                      className="w-full px-4 py-2 bg-bg-main border border-slate-600 rounded-lg text-text-primary focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Program Studi
                    </label>
                    <input
                      type="text"
                      value={programStudi}
                      onChange={(e) => setProgramStudi(e.target.value)}
                      className="w-full px-4 py-2 bg-bg-main border border-slate-600 rounded-lg text-text-primary focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Fakultas
                    </label>
                    <input
                      type="text"
                      value={fakultas}
                      onChange={(e) => setFakultas(e.target.value)}
                      className="w-full px-4 py-2 bg-bg-main border border-slate-600 rounded-lg text-text-primary focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </>
              )}

              {error && (
                <div className="bg-status-booked/20 border border-status-booked/50 rounded-lg p-3">
                  <p className="text-status-booked text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
              >
                {loading
                  ? 'Please wait...'
                  : isLogin
                  ? 'Login'
                  : 'Register'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                  }}
                  className="text-indigo-400 hover:text-indigo-300 text-sm"
                >
                  {isLogin
                    ? "Don't have an account? Register"
                    : 'Already have an account? Login'}
                </button>
              </div>
            </form>

            {isLogin && (
              <div className="mt-6 p-4 bg-bg-main rounded-lg">
                <p className="text-xs text-text-secondary mb-2">Demo Credentials:</p>
                <p className="text-xs text-text-secondary">
                  Email: <span className="text-text-primary">user@pradita.ac.id</span>
                </p>
                <p className="text-xs text-text-secondary">
                  Password: <span className="text-text-primary">any password</span>
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
};

