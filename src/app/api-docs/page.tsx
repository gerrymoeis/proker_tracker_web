'use client';

import React, { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import MainLayout from '@/components/layout/main-layout';

export default function ApiDocs() {
  const [spec, setSpec] = useState<any>(null);

  useEffect(() => {
    const fetchSpec = async () => {
      const response = await fetch('/api/swagger');
      const data = await response.json();
      setSpec(data);
    };

    fetchSpec();
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto py-8 max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text mb-4">
            API Documentation
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Dokumentasi lengkap API Proker Tracker untuk pengembangan dan integrasi
          </p>
        </div>

        <div className="bg-white text-black rounded-lg p-4 shadow-lg">
          {spec ? (
            <SwaggerUI spec={spec} />
          ) : (
            <div className="flex justify-center items-center h-96">
              <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
