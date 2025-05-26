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
              title: { type: 'string' },
              description: { type: 'string' },
              status: { type: 'string', enum: ['planned', 'in_progress', 'completed', 'cancelled'] },
              start_date: { type: 'string', format: 'date' },
              end_date: { type: 'string', format: 'date' },
              organization_id: { type: 'integer' },
              created_by: { type: 'integer' },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' },
            },
          },
          Task: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              title: { type: 'string' },
              description: { type: 'string' },
              status: { type: 'string', enum: ['todo', 'in_progress', 'review', 'completed'] },
              priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
              due_date: { type: 'string', format: 'date' },
              program_id: { type: 'integer' },
              assigned_to: { type: 'integer' },
              created_by: { type: 'integer' },
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
              role: { type: 'string' },
              organization_name: { type: 'string' },
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
        },
      },
    },
  });
  return spec;
};
