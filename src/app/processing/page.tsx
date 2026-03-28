'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProcessingLoader } from '@/components/ProcessingLoader';
import { StartupOverview, ProductSpec } from '@/types';

export default function ProcessingPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generatePlan = async () => {
      const inputData = sessionStorage.getItem('startupInput');
      if (!inputData) {
        router.push('/');
        return;
      }

      try {
        const { name, description } = JSON.parse(inputData);

        const overviewResponse = await fetch('/api/generate-overview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, description }),
        });

        if (!overviewResponse.ok) {
          throw new Error('Failed to generate overview');
        }

        const overview: StartupOverview = await overviewResponse.json();

        sessionStorage.setItem('startupOverview', JSON.stringify(overview));

        setTimeout(() => {
          router.push('/overview');
        }, 6000);
      } catch (err) {
        setError('Failed to generate startup plan. Please try again.');
        setTimeout(() => router.push('/'), 2000);
      }
    };

    generatePlan();
  }, [router]);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <ProcessingLoader />
    </main>
  );
}
