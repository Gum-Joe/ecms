SELECT COUNT(*) FROM roles
WHERE role_id IN (
	SELECT role_id FROM join_roles_users
	WHERE user_id = (SELECT user_id FROM users WHERE email = 'jaskishansaran@gmail.com')
)
AND path @> ARRAY['root.events.entry', 'root.events.modify']::ltree[]