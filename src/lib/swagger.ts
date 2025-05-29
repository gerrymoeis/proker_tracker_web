import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api', // Path to API routes
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Proker Tracker API Documentation',
        version: '1.0.0',
        description: 'API documentation for Proker Tracker - Aplikasi Manajemen Program Kerja untuk Organisasi Mahasiswa',
        contact: {
          name: 'Kelompok 7 SIM',
          email: 'kelompok7@example.com',
        },
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
        {
          url: 'https://proker-tracker.netlify.app',
          description: 'Production server',
        },
      ],
      tags: [
        {
          name: 'Auth',
          description: 'Authentication endpoints',
        },
        {
          name: 'Organizations',
          description: 'Organization management endpoints',
        },
        {
          name: 'Members',
          description: 'Member management endpoints',
        },
        {
          name: 'Programs',
          description: 'Program management endpoints',
        },
        {
          name: 'Tasks',
          description: 'Task management endpoints',
        },
        {
          name: 'Comments',
          description: 'Comment management endpoints',
        },
        {
          name: 'Users',
          description: 'User management endpoints',
        },
        {
          name: 'Stats',
          description: 'Statistics endpoints',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
        schemas: {
          Organization: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string' },
              description: { type: 'string' },
              university: { type: 'string' },
              faculty: { type: 'string' },
              department: { type: 'string' },
              logo: { type: 'string', nullable: true },
              members: { type: 'integer' },
              programs: { type: 'integer' },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' },
            },
          },
          Member: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string' },
              organization_name: { type: 'string' },
              profile_image: { type: 'string', nullable: true },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' },
            },
          },
          Program: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string' },
              description: { type: 'string' },
              status: { type: 'string', enum: ['belum_dimulai', 'dalam_progres', 'selesai', 'dibatalkan'] },
              start_date: { type: 'string', format: 'date' },
              end_date: { type: 'string', format: 'date' },
              department_id: { type: 'integer' },
              department_name: { type: 'string' },
              pic_id: { type: 'integer' },
              pic_name: { type: 'string' },
              budget: { type: 'integer' },
              organization_id: { type: 'integer' },
              organization_name: { type: 'string' },
              progress: { type: 'integer', minimum: 0, maximum: 100 },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' },
            },
          },
          Task: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string' },
              description: { type: 'string' },
              status: { type: 'string', enum: ['belum_dimulai', 'dalam_progres', 'selesai', 'dibatalkan'] },
              priority: { type: 'string', enum: ['rendah', 'sedang', 'tinggi', 'kritis'] },
              due_date: { type: 'string', format: 'date' },
              program_id: { type: 'integer' },
              program_name: { type: 'string' },
              assigned_to: { type: 'integer' },
              assigned_name: { type: 'string' },
              created_by: { type: 'integer' },
              created_by_name: { type: 'string' },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' },
            },
          },
          Comment: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              content: { type: 'string' },
              task_id: { type: 'integer' },
              user_id: { type: 'integer' },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' },
            },
          },
          User: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string', enum: ['admin', 'ketua', 'wakil_ketua', 'kepala_departemen', 'anggota'] },
              organization_name: { type: 'string' },
              organization_id: { type: 'integer' },
              department_id: { type: 'integer', nullable: true },
              department_name: { type: 'string', nullable: true },
              profile_image: { type: 'string', nullable: true },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' },
            },
          },
          Error: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              error: { type: 'string' },
            },
          },
          Department: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string' },
              description: { type: 'string', nullable: true },
              head_id: { type: 'integer', nullable: true },
              head_name: { type: 'string', nullable: true },
              organization_id: { type: 'integer' },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' },
            },
          },
          Stats: {
            type: 'object',
            properties: {
              activePrograms: { type: 'integer' },
              pendingTasks: { type: 'integer' },
              completedMilestones: { type: 'integer' },
              activeMembers: { type: 'integer' },
            },
          },
          ForgotPassword: {
            type: 'object',
            properties: {
              email: { type: 'string' },
              token: { type: 'string' },
              created_at: { type: 'string', format: 'date-time' },
              expires_at: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  });
  return spec;
};
