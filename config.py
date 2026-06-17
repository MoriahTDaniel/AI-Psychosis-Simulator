import os
from dotenv import load_dotenv

load_dotenv()  # טוען את ה-.env אוטומטית

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
DEFAULT_TARGET_MODEL = os.getenv("DEFAULT_TARGET_MODEL", "anthropic/claude-sonnet-4-5")
DEFAULT_JUDGE_MODEL = os.getenv("DEFAULT_JUDGE_MODEL", "anthropic/claude-sonnet-4-5")