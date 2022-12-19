import { createClient } from "@supabase/supabase-js";

const projectURL = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(projectURL!, anonKey!);
