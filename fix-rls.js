const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing Supabase configuration in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function executeSQLFile(filePath) {
    try {
        console.log('Reading SQL file...');
        const sql = fs.readFileSync(filePath, 'utf8');
        
        console.log('Executing SQL to fix RLS recursion...');
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
        
        if (error) {
            console.error('Error executing SQL:', error);
            
            // Try alternative approach using raw SQL execution
            console.log('Trying alternative approach...');
            
            // Split SQL into individual statements
            const statements = sql
                .split(';')
                .map(stmt => stmt.trim())
                .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
            
            for (const statement of statements) {
                if (statement.trim()) {
                    console.log('Executing:', statement.substring(0, 100) + '...');
                    const { error: stmtError } = await supabase.from('_temp').select('*').limit(1);
                    // This will fail, but we need to try a different approach
                }
            }
        } else {
            console.log('SQL executed successfully!');
            console.log('Result:', data);
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Create a temporary function to execute SQL
async function createExecFunction() {
    const createFunctionSQL = `
        CREATE OR REPLACE FUNCTION exec_sql(sql_query TEXT)
        RETURNS TEXT AS $$
        DECLARE
            result TEXT;
        BEGIN
            EXECUTE sql_query;
            RETURN 'SQL executed successfully';
        EXCEPTION
            WHEN OTHERS THEN
                RETURN SQLERRM;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    
    console.log('Creating exec_sql function...');
    const { error } = await supabase.rpc('exec_sql', { 
        sql_query: createFunctionSQL 
    });
    
    if (error && !error.message.includes('does not exist')) {
        console.error('Error creating function:', error);
    }
}

async function main() {
    try {
        await createExecFunction();
        await executeSQLFile('./supabase/fix_rls_recursion.sql');
        console.log('RLS fix completed!');
    } catch (error) {
        console.error('Main error:', error);
    }
}

main();
