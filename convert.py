"""
Excel -> JSON converter for produktionsprocess data.
Run from the produktionsprocess/ directory:
    pip install openpyxl
    python convert.py
"""

import json
import re
import os
import openpyxl

EXCEL_FILE = "st-process.xlsx"
OUTPUT_FILE = "src/data/data.json"


def clean(val):
    """Strip whitespace; treat em-dash, literal 'None', and empty string as None."""
    if val is None:
        return None
    s = str(val).strip()
    if s in ("", "—", "-", "None", "none"):
        return None
    return s


def read_sheet(sheet):
    rows = list(sheet.values)
    headers = [str(h).strip() for h in rows[0]]
    return [dict(zip(headers, row)) for row in rows[1:] if any(v is not None for v in row)]


def phase_sort_key(phase_id):
    m = re.search(r"(\d+)$", phase_id)
    return int(m.group(1)) if m else 0


wb = openpyxl.load_workbook(EXCEL_FILE)

faser      = read_sheet(wb["Faser"])
uppgifter  = read_sheet(wb["Uppgifter"])
samlingar  = read_sheet(wb["Samlingar"])
avdelningar = read_sheet(wb["Avdelningar"])

# --- Categories ---
categories = [
    {"id": clean(r["category_id"]), "label": clean(r["label"])}
    for r in avdelningar
    if clean(r.get("category_id"))
]

# --- Collections map: collection_id -> data ---
collections_map = {}
for r in samlingar:
    cid = clean(r["collection_id"])
    if not cid:
        continue
    collections_map[cid] = {
        "id": cid,
        "_phase_id": clean(r["phase_id"]),
        "title": clean(r["collection_title"]),
        "notes": clean(r.get("collection_notes")),
        "tasks": [],
    }

# --- Tasks: assign to collections or standalone per phase ---
standalone_tasks = {}  # phase_id -> [task]
for r in uppgifter:
    task = {
        "id": clean(r["task_id"]),
        "title": clean(r["task_title"]),
        "content": clean(r["task_content"]),
        "category_id": clean(r["category_id"]),
        "gantt": clean(r["task_gantt"]),
    }
    pid = clean(r["phase_id"])
    cid = clean(r.get("collection_id"))

    if cid and cid in collections_map:
        collections_map[cid]["tasks"].append(task)
    else:
        standalone_tasks.setdefault(pid, []).append(task)

# --- Phases ---
phases = []
for r in faser:
    pid = clean(r["phase_id"])
    if not pid:
        continue

    port_title = clean(r["port_title"])
    port = None
    if port_title:
        port = {
            "title": port_title,
            "deadline": clean(r["port_deadline"]),
            "content": clean(r["port_content"]),
        }

    phase_collections = [
        {k: v for k, v in col.items() if k != "_phase_id"}
        for col in collections_map.values()
        if col["_phase_id"] == pid
    ]

    phases.append({
        "id": pid,
        "name": clean(r["phase_name"]),
        "duration": clean(r["duration"]),
        "port": port,
        "tasks": standalone_tasks.get(pid, []),
        "collections": phase_collections,
    })

phases.sort(key=lambda p: phase_sort_key(p["id"]))

output = {"categories": categories, "phases": phases}

os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Done: {len(phases)} phases, {len(categories)} categories, "
      f"{sum(len(p['tasks']) for p in phases)} standalone tasks, "
      f"{sum(len(p['collections']) for p in phases)} collections")
