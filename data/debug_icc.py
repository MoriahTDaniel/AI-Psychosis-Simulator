import pandas as pd
import pingouin as pg
import numpy as np

def debug_single_group():
    print("📥 קורא את הנתונים לטובת דיבאג...")
    df_wide = pd.read_csv('2_Raw_Scores_Wide_Format_For_Reliability.csv')
    
    id_vars = ['Theme', 'Intervention', 'Explicitness', 'Run_ID']
    value_vars = [col for col in df_wide.columns if col not in id_vars]
    
    df_long = df_wide.melt(id_vars=id_vars, value_vars=value_vars, var_name='Metric_Turn', value_name='Score')
    df_long[['Metric', 'Turn']] = df_long['Metric_Turn'].str.extract(r'([A-Z]+)_Turn_(\d+)')
    df_long['Turn'] = df_long['Turn'].astype(int)
    df_long['Score'] = pd.to_numeric(df_long['Score'], errors='coerce')
    
    # סינון רק לקבוצה אחת בעייתית במיוחד
    debug_df = df_long[
        (df_long['Theme'] == 'Case_2_1_The_Digital_Romance') & 
        (df_long['Intervention'] == 'CONTROL') & 
        (df_long['Explicitness'] == 'EXPLICIT') & 
        (df_long['Metric'] == 'DCS')
    ].copy()
    
    # הסרת ריקים
    debug_df = debug_df.dropna(subset=['Score'])
    
    print("\n" + "="*50)
    print("🔍 נתוני דיבאג עבור הקבוצה: Case_2_1_The_Digital_Romance | CONTROL | EXPLICIT | DCS")
    print("="*50)
    
    print(f"\n1. כמות תורות: {debug_df['Turn'].nunique()} (אמור להיות 9 תורות עבור DCS, מ-4 עד 12)")
    print(f"2. כמות הרצות (שופטים): {debug_df['Run_ID'].nunique()} (אמור להיות 30)")
    
    print("\n3. שונות בכל תור (אם הכל כאן 0, אי אפשר לחשב ICC):")
    print(debug_df.groupby('Turn')['Score'].var())
    
    print("\n4. הצצה למטריצה האמיתית (5 הרצות ראשונות):")
    pivot = debug_df.pivot(index='Run_ID', columns='Turn', values='Score')
    print(pivot.head())
    
    print("\n5. ספירת ערכים חסרים במטריצה (NaNs):")
    print(pivot.isna().sum())
    
    print("\n6. מפעיל את Pingouin...")
    try:
        res = pg.intraclass_corr(
            data=debug_df, 
            targets='Turn', 
            raters='Run_ID', 
            ratings='Score', 
            nan_policy='omit'
        )
        print("\n✅ הפלט של Pingouin:")
        print(res)
    except Exception as e:
        print(f"\n❌ קריסה בתוך Pingouin: {e}")

if __name__ == '__main__':
    debug_single_group()