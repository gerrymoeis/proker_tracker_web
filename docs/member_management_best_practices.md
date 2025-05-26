# Best Practices for Member Management in Proker Tracker

## Current Data Model Analysis

After reviewing the current database schema and implementation, I've identified the following structure for member management:

1. **Users Table**
   - Contains basic user information (id, name, email, password, organization_name)
   - Has a `role` field with organization-level roles

2. **Organization Members Table**
   - Links users to organizations and departments
   - Contains a `department_id` field to associate users with departments
   - Has a separate `role` field for role within the organization/department

3. **Departments Table**
   - Contains department information
   - Has a `head_id` field to designate a department head

## Identified Issues

1. **Role Management Complexity**
   - Users have roles in both the `users` table and the `organization_members` table
   - Unclear which role takes precedence in different contexts

2. **Department Assignment**
   - Users are assigned to departments through the `organization_members` table
   - No clear way to assign a user to multiple departments

3. **Task Assignment**
   - Tasks are assigned through the `task_assignments` table
   - No role-based filtering for task assignment

## Best Practices Recommendations

### 1. Unified Role Management

#### Recommendation
Use the `organization_members` table as the single source of truth for user roles within an organization.

#### Implementation
1. **Deprecate the role field in the users table**
   - Keep it for backward compatibility but don't use it for new features
   - Add a migration to sync existing roles to the `organization_members` table

2. **Enhance the role field in organization_members**
   - Update the ENUM to include all possible roles:
     ```sql
     ALTER TABLE organization_members 
     MODIFY COLUMN role ENUM(
       'admin', 
       'ketua', 
       'wakil_ketua', 
       'sekretaris', 
       'bendahara', 
       'kepala_departemen', 
       'anggota',
       'staff_departemen'
     ) NOT NULL DEFAULT 'anggota';
     ```

3. **Create role hierarchy**
   - Implement a role hierarchy in the application code:
     ```typescript
     const ROLE_HIERARCHY = {
       'admin': 100,
       'ketua': 90,
       'wakil_ketua': 80,
       'sekretaris': 70,
       'bendahara': 70,
       'kepala_departemen': 60,
       'staff_departemen': 50,
       'anggota': 10
     };
     
     // Helper function to check if a user has sufficient role
     function hasRole(userRole: string, requiredRole: string): boolean {
       return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
     }
     ```

### 2. Multi-Department Membership

#### Recommendation
Allow users to be members of multiple departments with different roles in each.

#### Implementation
1. **Update the organization_members table**
   - Remove the unique constraint on (organization_id, user_id)
   - Add a unique constraint on (organization_id, user_id, department_id)
   - This allows a user to have multiple entries, one for each department

2. **API for managing department membership**
   - Create endpoints to add/remove users from departments:
     ```
     POST /api/departments/[id]/members
     DELETE /api/departments/[id]/members/[userId]
     ```

3. **UI for department assignment**
   - Add a multi-select interface in the user profile to assign departments
   - Allow setting different roles per department assignment

### 3. Task Assignment System

#### Recommendation
Implement a role-aware task assignment system that respects department membership.

#### Implementation
1. **Enhance the task_assignments table**
   - Add a `role_required` field to specify the minimum role needed
   - Add a `department_id` field to associate tasks with departments

2. **Task assignment API**
   - Filter eligible assignees based on:
     - Department membership
     - Role requirements
     - Current workload

3. **Task creation workflow**
   - When creating a task, allow specifying:
     - The program it belongs to
     - The milestone it's associated with
     - The department responsible
     - The minimum role required
     - Specific assignees (optional)

### 4. Department Staff Management

#### Recommendation
Create a clear distinction between department heads and staff members.

#### Implementation
1. **Department head designation**
   - Continue using the `head_id` in the departments table
   - Ensure this user also has an entry in `organization_members` with the appropriate role

2. **Department staff designation**
   - Use the `staff_departemen` role in `organization_members`
   - Create a view or query to easily get all staff for a department:
     ```sql
     CREATE VIEW department_staff AS
     SELECT 
       d.id as department_id, 
       d.name as department_name,
       u.id as user_id,
       u.name as user_name,
       u.email,
       om.role
     FROM departments d
     JOIN organization_members om ON d.id = om.department_id
     JOIN users u ON om.user_id = u.id
     WHERE om.role IN ('kepala_departemen', 'staff_departemen');
     ```

3. **Staff management UI**
   - Create a dedicated interface for managing department staff
   - Allow bulk assignment/removal of staff members
   - Provide role selection for each staff member

### 5. Activity Tracking

#### Recommendation
Implement a comprehensive activity tracking system to monitor member contributions.

#### Implementation
1. **Activity log table**
   ```sql
   CREATE TABLE activity_logs (
     id INT AUTO_INCREMENT PRIMARY KEY,
     user_id INT NOT NULL,
     organization_id INT NOT NULL,
     department_id INT,
     program_id INT,
     task_id INT,
     action_type ENUM('created', 'updated', 'deleted', 'completed', 'assigned', 'commented') NOT NULL,
     entity_type ENUM('program', 'milestone', 'task', 'comment', 'department', 'member') NOT NULL,
     entity_id INT NOT NULL,
     details JSON,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
     FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
     FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
     FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE SET NULL,
     FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
   );
   ```

2. **Activity tracking middleware**
   - Create a middleware to log important actions
   - Implement hooks in API routes to record activities

3. **Activity feed UI**
   - Create a personalized activity feed for each user
   - Filter activities by department, program, or task

## Implementation Plan

### Phase 1: Database Schema Updates
1. Update the `organization_members` table to support multi-department membership
2. Enhance the role ENUM in `organization_members`
3. Create the activity_logs table

### Phase 2: API Enhancements
1. Update department member management APIs
2. Create task assignment APIs with role awareness
3. Implement activity logging middleware

### Phase 3: UI Implementation
1. Enhance department staff management UI
2. Improve task assignment interface
3. Create activity feed dashboard

### Phase 4: Testing and Refinement
1. Test multi-department membership
2. Verify role-based permissions
3. Validate task assignment workflow

## Conclusion

By implementing these best practices, the Proker Tracker application will have a more robust and flexible system for managing organization members, department assignments, and task allocation. The role-based approach ensures proper access control while the multi-department membership capability addresses the complex organizational structures common in many organizations.

The activity tracking system will provide valuable insights into member contributions and help identify bottlenecks or underutilized resources. Overall, these enhancements will significantly improve the usability and effectiveness of the Proker Tracker application for managing organizational programs and tasks.
