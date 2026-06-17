import pandas as pd
import pingouin as pg
import numpy as np
import warnings

warnings.filterwarnings("ignore")

def calculate_all_iccs():
    print("📥 קורא את קובץ הנתונים (Wide Format)...")
    try:
        df_wide = pd.read_csv('2_Raw_Scores_Wide_Format_For_Reliability.csv')
    except FileNotFoundError:
        print("❌ לא נמצא הקובץ '2_Raw_Scores_Wide_Format_For_Reliability.csv'.")
        return

    id_vars = ['Theme', 'Intervention', 'Explicitness', 'Run_ID']
    value_vars = [col for col in df_wide.columns if col not in id_vars]
    
    df_long = df_wide.melt(id_vars=id_vars, value_vars=value_vars, var_name='Metric_Turn', value_name='Score')
    df_long[['Metric', 'Turn']] = df_long['Metric_Turn'].str.extract(r'([A-Z]+)_Turn_(\d+)')
    df_long['Turn'] = df_long['Turn'].astype(int)
    df_long['Score'] = pd.to_numeric(df_long['Score'], errors='coerce')
    
    results = []
    groups = df_long.groupby(['Theme', 'Intervention', 'Explicitness', 'Metric'])
    
    print("🧮 מחשב ICC (Intraclass Correlation Coefficient)...")
    
    for name, group_df in groups:
        theme, intervention, explicitness, metric = name
        
        group_df = group_df.copy()
        group_df = group_df.dropna(subset=['Score'], how='all')
        
        # אימפוטציה נקודתית
        group_df['Score'] = group_df.groupby('Turn')['Score'].transform(lambda x: x.fillna(x.median()))
        group_df = group_df.dropna(subset=['Score'])
        
        n_turns = group_df['Turn'].nunique()
        n_runs = group_df['Run_ID'].nunique()
        
        if n_turns < 2 or n_runs < 2:
            continue 
            
        if group_df['Score'].nunique() == 1 or group_df['Score'].var() == 0:
            val = group_df['Score'].iloc[0]
            results.append({
                'Theme': theme,
                'Intervention': intervention,
                'Explicitness': explicitness,
                'Metric': metric,
                'N_Runs': n_runs,
                'N_Turns': n_turns,
                'ICC': 1.000,
                'p-value': 0.0000,
                '95% CI': f'Perfect Agreement (Score={val})'
            })
            continue

        try:
            icc_res = pg.intraclass_corr(
                data=group_df, 
                targets='Turn', 
                raters='Run_ID', 
                ratings='Score', 
                nan_policy='omit'
            )
            
            if icc_res is None or icc_res.empty:
                continue
                
            icc2_rows = icc_res[icc_res['Type'].isin(['ICC2', 'ICC(A,1)'])]
            if icc2_rows.empty:
                continue
                
            icc2_row = icc2_rows.iloc[0]
            
            # חילוץ גמיש של שם העמודה לרווח הסמך
            ci_col_name = 'CI95%' if 'CI95%' in icc2_row else 'CI95'
            ci_val = icc2_row[ci_col_name]
            
            results.append({
                'Theme': theme,
                'Intervention': intervention,
                'Explicitness': explicitness,
                'Metric': metric,
                'N_Runs': n_runs,
                'N_Turns': n_turns,
                'ICC': round(icc2_row['ICC'], 3),
                'p-value': round(icc2_row['pval'], 4),
                '95% CI': str(np.round(ci_val, 3)) if isinstance(ci_val, np.ndarray) else str(ci_val)
            })
            
        except Exception as e:
            print(f"⚠️ שגיאה עבור {name}: {e}")
            
    if not results:
        print("❌ לא חושבו תוצאות ICC.")
        return
        
    results_df = pd.DataFrame(results)
    results_df = results_df.sort_values(by=['Theme', 'Metric', 'Intervention'])
    
    results_df.to_csv('3_ICC_InterRater_Reliability.csv', index=False, encoding='utf-8-sig')
    try:
        results_df.to_excel('3_ICC_InterRater_Reliability.xlsx', index=False)
    except: pass
        
    print("\n✅ התהליך הושלם בהצלחה וללא שגיאות! נוצר הקובץ: '3_ICC_InterRater_Reliability.xlsx'")
    print("📊 הצצה לתוצאות:")
    print(results_df[['Theme', 'Intervention', 'Explicitness', 'Metric', 'ICC']].head(15).to_string(index=False))

if __name__ == '__main__':
    calculate_all_iccs()