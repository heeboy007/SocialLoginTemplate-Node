
const postgres_pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: postgres_user,
    password: postgres_pass,
    database: postgres_db,
    max: 20, // 커넥션 풀 최대치
});

export { 
    postgres_pool,
};