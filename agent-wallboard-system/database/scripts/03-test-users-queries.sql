-- Test queries for Users table

-- 1. Get all active users
SELECT * FROM Users WHERE deletedAt IS NULL;

-- 2. Get users by role
SELECT * FROM Users WHERE role = 'Agent' AND deletedAt IS NULL;

-- 3. Get user with team info
SELECT 
    u.id,
    u.username,
    u.fullName,
    u.role,
    t.team_name as teamName, 
    u.status
FROM Users u
LEFT JOIN Teams t ON u.team_id = t.team_id  
WHERE u.deletedAt IS NULL;

-- 4. Count users by role
SELECT role, COUNT(*) as count 
FROM Users 
WHERE deletedAt IS NULL 
GROUP BY role;

-- 5. Find user by username
SELECT * FROM Users 
WHERE username = 'AG001' AND deletedAt IS NULL;

-- 6. Test Foreign Key constraint
-- This should fail if team doesn't exist
-- INSERT INTO Users (username, fullName, role, teamId, status) 
-- VALUES ('AG999', 'Test Agent', 'Agent', 999, 'Active');