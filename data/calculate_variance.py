import os
import json
import pandas as pd
import numpy as np
import re
from pathlib import Path

def extract_turns_robust(data):
    """ חיפוש חכם של מערך התורות בתוך ה-JSON """
    for key in ['turns', 'history', 'dialogue', 'interactions']:
        if key in data and isinstance(data[key], list):
            return data[key]
            
    if 'experiment' in data:
        for key in ['turns', 'history', 'dialogue', 'interactions']:
            if key in data['experiment'] and isinstance(data['experiment'][key], list):
                return data['experiment'][key]
                
    def recursive_search(node):
        if isinstance(node, dict):
            for v in node.values():
                if isinstance(v, list) and len(v) > 0 and isinstance(v[0], dict):
                    if 'scores' in v[0] or 'metrics' in v[0] or 'bot_response' in v[0]:
                        return v
            for v in node.values():
                res = recursive_search(v)
                if res: return res
        elif isinstance(node, list):
            if len(node) > 0 and isinstance(node[0], dict):
                if 'scores' in node[0] or 'metrics' in node[0] or 'bot_response' in node[0]:
                    return node
            for item in node:
                res = recursive_search(item)
                if res: return res
        return []
        
    return recursive_search(data)

def generate_variance_and_reliability_data():
    print("🔍 מתחיל בסריקת תיקיית outputs...")
    base_dir = Path('.')
    data = []
    
    json_files = list(base_dir.rglob('**/raw_logs/Task_*.json'))
    
    if not json_files:
        print("❌ לא נמצאו קבצי JSON. ודאי שהסקריפט רץ מתוך תיקיית outputs.")
        return
        
    print(f"✅ נמצאו {len(json_files)} קבצי ניסוי פוטנציאליים. מתחיל סינון ועיבוד...\n")
    
    valid_count = 0
    
    for file_path in json_files:
        file_name = file_path.name
        
        is_control = 'CONTROL' in file_name
        is_pcbt = 'PCBT' in file_name
        is_explicit = 'EXPLICIT' in file_name
        is_implicit = 'IMPLICIT' in file_name
        
        if not ((is_control or is_pcbt) and (is_explicit or is_implicit)):
            continue
            
        valid_count += 1
        
        intervention = 'PCBT' if is_pcbt else 'CONTROL'
        explicitness = 'EXPLICIT' if is_explicit else 'IMPLICIT'
        
        run_id_match = re.search(r'Task_\d+', file_name)
        run_id = run_id_match.group(0) if run_id_match else "Unknown_ID"
        
        theme = file_name.replace(run_id, "").replace(intervention, "").replace(explicitness, "").replace(".json", "")
        theme = re.sub(r'_+', '_', theme).strip('_')
        
        with open(file_path, 'r', encoding='utf-8') as f:
            try:
                run_data = json.load(f)
                turns_list = extract_turns_robust(run_data)
                
                for i, turn in enumerate(turns_list):
                    turn_num = turn.get('turn_number', i + 1)
                    scores = turn.get('scores', turn.get('metrics', {}))
                    
                    # חילוץ בטוח (המרה ל-float כדי שנוכל להשתמש ב-np.nan)
                    dcs = scores.get('dcs', scores.get('DCS', np.nan))
                    sis = scores.get('sis', scores.get('SIS', np.nan))
                    hes = scores.get('hes', scores.get('HES', np.nan))
                    
                    # ---------------------------------------------------------
                    # לוגיקת הניקוי והתיקון (בהתאם ל-scoring.py):
                    # 1. אם הציון הוא -1, הוא מומר ל-NaN.
                    # 2. אם התור מוקדם מדי למדד, הוא מומר ל-NaN.
                    # ---------------------------------------------------------
                    
                    if pd.isna(dcs) or dcs == -1 or turn_num < 4:
                        dcs = np.nan
                    else:
                        dcs = float(dcs)
                        
                    if pd.isna(hes) or hes == -1 or turn_num < 7:
                        hes = np.nan
                    else:
                        hes = float(hes)
                        
                    if pd.isna(sis) or sis == -1 or turn_num < 7:
                        sis = np.nan
                    else:
                        sis = float(sis)
                        
                    data.append({
                        'Theme': theme,
                        'Intervention': intervention,
                        'Explicitness': explicitness,
                        'Run_ID': run_id,
                        'Turn': turn_num,
                        'DCS': dcs,
                        'SIS': sis,
                        'HES': hes
                    })
            except Exception as e:
                print(f"⚠️ שגיאה בקריאת הקובץ {file_name}: {e}")

    if not data:
        print("❌ לא חולצו נתונים.")
        return

    print(f"✔️ עובדו בהצלחה {valid_count} קבצים חוקיים.")
    
    df = pd.DataFrame(data)
    
    # הסרת שורות ריקות לחלוטין (כמו תורות 1-3 שאין בהם אף ציון)
    df = df.dropna(subset=['DCS', 'SIS', 'HES'], how='all')
    
    # =========================================================
    # קובץ 1: סיכום סטטיסטי מפורש לפי תור
    # =========================================================
    print("🧮 מכין טבלת סיכום שונות (Variance Summary)...")
    summary = df.groupby(['Theme', 'Intervention', 'Explicitness', 'Turn']).agg({
        'DCS': ['mean', 'var', 'std'],
        'SIS': ['mean', 'var', 'std'],
        'HES': ['mean', 'var', 'std'],
        'Run_ID': 'count'
    }).reset_index()
    
    summary.columns = ['_'.join(col).strip('_') for col in summary.columns.values]
    summary.rename(columns={'Run_ID_count': 'N'}, inplace=True)
    summary = summary.round(3)
    
    summary.to_csv('1_Variance_Summary_Per_Turn.csv', index=False, encoding='utf-8-sig')
    try:
        summary.to_excel('1_Variance_Summary_Per_Turn.xlsx', index=False)
    except Exception: pass
    
    # =========================================================
    # קובץ 2: פריסה רחבה (Wide Format) למבחני מהימנות
    # =========================================================
    print("📐 מכין מטריצת התפלגות ציונים (Wide Format)...")
    df_wide = df.pivot_table(
        index=['Theme', 'Intervention', 'Explicitness', 'Run_ID'],
        columns='Turn',
        values=['DCS', 'SIS', 'HES']
    )
    
    df_wide.columns = [f"{metric}_Turn_{int(turn)}" for metric, turn in df_wide.columns]
    df_wide = df_wide.reset_index()
    
    df_wide.to_csv('2_Raw_Scores_Wide_Format_For_Reliability.csv', index=False, encoding='utf-8-sig')
    try:
        df_wide.to_excel('2_Raw_Scores_Wide_Format_For_Reliability.xlsx', index=False)
    except Exception: pass
    
    print("\n🎉 התהליך הושלם בהצלחה! הקבצים תוקנו והם נקיים מאפסים שגויים.")

if __name__ == "__main__":
    generate_variance_and_reliability_data()