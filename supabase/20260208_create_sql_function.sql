-- Function to execute raw SQL statements
CREATE OR REPLACE FUNCTION sql(sql_query TEXT)
RETURNS VOID AS $$
BEGIN
    EXECUTE sql_query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
