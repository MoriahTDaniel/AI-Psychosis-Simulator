import pandas as pd
import os

# 1. הגדרת נתיב הקובץ המקורי
file_path = r"C:\Users\moria\Documents\פסיכוביולוגיה\פסיכוביולוגיה\שנה ב\סמסטר ב\פסיכולוגיה ניסויית\project\AI-Psychosis-Simulator\data\Combined_All_Cases.csv"
base_dir = os.path.dirname(file_path)

print("Loading data...")
df = pd.read_csv(file_path)

# --- משימה 1: המרת הקובץ המלא לאקסל ---
excel_path = os.path.join(base_dir, "Combined_All_Cases.xlsx")
df.to_excel(excel_path, index=False)
print(f"✅ Full file saved to Excel: {excel_path}")

# --- משימה 2: יצירת עמודת Explicitness מתוך Case_Name ---
# אנחנו מחלצים את המילה EXPLICIT או IMPLICIT מתוך שם התרחיש
def extract_explicitness(case_name):
    case_name_str = str(case_name).upper()
    if 'EXPLICIT' in case_name_str:
        return 'EXPLICIT'
    elif 'IMPLICIT' in case_name_str:
        return 'IMPLICIT'
    return 'UNKNOWN'

df['Explicitness'] = df['Case_Name'].apply(extract_explicitness)

# --- משימה 3: חישוב ממוצעים לפי קבוצות ---
# אנחנו מקבצים לפי התנאי (CONTROL/PCBT) ולפי המפורשות (EXPLICIT/IMPLICIT)
# ומחשבים את הממוצע של שלושת המדדים שלנו.
summary_df = df.groupby(['Condition', 'Explicitness'])[['Avg_DCS', 'Avg_HES', 'Total_SIS']].mean().reset_index()

# מעגלים ל-2 ספרויות עשרוניות כדי שיהיה קל להציג בטבלה
summary_df = summary_df.round(2)

# --- משימה 4: שמירת קובץ הסיכום (SUM) ב-CSV ובאקסל ---
sum_csv_path = os.path.join(base_dir, "Combined_All_Cases_SUM.csv")
sum_excel_path = os.path.join(base_dir, "Combined_All_Cases_SUM.xlsx")

summary_df.to_csv(sum_csv_path, index=False)
summary_df.to_excel(sum_excel_path, index=False)

print(f"✅ Summary files saved successfully:")
print(f"   - CSV:   {sum_csv_path}")
print(f"   - Excel: {sum_excel_path}\n")

print("Summary of average scores by group:")