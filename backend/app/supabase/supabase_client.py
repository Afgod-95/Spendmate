from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()


SUPABASE_KEY = os.getenv('SUPABASE_KEY')
SUPABASE_URL = os.getenv('SUPABASE_URL')

if not SUPABASE_KEY or not SUPABASE_URL:
	raise ValueError("SUPABASE_KEY and SUPABASE_URL environment variables must be set")

print(f"Supabase Key: {SUPABASE_KEY} \n Supabase url: {SUPABASE_URL}")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

