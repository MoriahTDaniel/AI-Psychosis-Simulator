// ============================================================================
//  Conversation Data Pipeline
//  ----------------------------------------------------------------------------
//  Loads the REAL experiment conversations from the raw output files and exposes
//  a clean lookup keyed by the experiment matrix: Theme × Explicitness × Condition.
//
//  The experiment produced 480 JSON files under data/<run>/raw_logs/. We only
//  bundle ONE representative repetition per matrix cell (repetition #1):
//      Task_001 -> CONTROL + EXPLICIT
//      Task_031 -> PCBT    + EXPLICIT
//      Task_061 -> CONTROL + IMPLICIT
//      Task_091 -> PCBT    + IMPLICIT
//  across the 4 themes that have data => 16 files total (not all 480).
// ============================================================================

// Vite bundles only the matched files. The brace pattern matches exactly the
// rep-#1 task of each cell (001/031/061/091); `import: 'default'` gives the
// parsed JSON object directly.
const files = import.meta.glob(
  '../../data/*/raw_logs/Task_0{01,31,61,91}_*.json',
  { eager: true, import: 'default' }
);

// Build the lookup map.
// Raw shape: { timestamp, experiment: { model, prompt_condition, test_case, summary }, conversation }
// We normalize each entry into the flat shape the UI already consumes
// (currentExperiment.model / .test_case / .summary / .conversation.turns).
const conversations = {};

for (const raw of Object.values(files)) {
  if (!raw || !raw.experiment) continue;
  const { experiment, conversation } = raw;
  const id = experiment.test_case?.id;             // e.g. "digital_romance_explicit"
  const cond = experiment.prompt_condition;        // "control" | "pcbt"
  if (!id || !cond) continue;

  conversations[`${id}_${cond}`] = {
    model: experiment.model,
    test_case: experiment.test_case,
    summary: experiment.summary,
    conversation, // { turns, total_turns }
    taskId: experiment.metadata?.run_id, // e.g. "Task_031"
  };
}

/**
 * Look up the representative conversation for a matrix cell.
 * @param {string} theme        e.g. "digital_romance"
 * @param {string} explicitness "explicit" | "implicit"
 * @param {string} condition    "control" | "pcbt"
 * @returns normalized experiment object, or null if no data exists for the cell.
 */
export function getConversation(theme, explicitness, condition) {
  return conversations[`${theme}_${explicitness}_${condition}`] || null;
}

// The 4 themes that actually have experiment data. Single source of truth so
// the SimulatorTab dropdown and App default state stay in sync.
export const AVAILABLE_THEMES = [
  { value: 'digital_romance', label: '2: The Digital Romance (Attachment)' },
  { value: 'secret_project', label: '4: The Secret Project (Property/Harm)' },
  { value: 'messianic_union', label: '5: The Messianic Union (Cult)' },
  { value: 'unseen_connections', label: '7: The Unseen Connections (Isolation)' },
];
