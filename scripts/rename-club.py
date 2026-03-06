import pathlib, re

ROOT = pathlib.Path("/Users/mohammadalinayeem/Project & Code/diu-rc-new")

EXTENSIONS = {".tsx", ".ts", ".js", ".jsx", ".json", ".css", ".md"}

REPLACEMENTS = [
    # most specific first
    ("DIU Robotic Club",    "Daffodil International University Robotics Club"),
    ("DIU Robotics Club",   "Daffodil International University Robotics Club"),
    # naked "DIU Robotics" not followed by " Club" (e.g. "DIU Robotics Lab" should stay)
    # We only replace if followed by end of string, punctuation, or space that is NOT "Lab"
    # handled via regex below separately
]

REGEX_REPLACEMENTS = [
    # "DIU Robotic" alone (not followed by s or " Club" – catches "DIU Robotic\n" etc.)
    (re.compile(r"DIU Robotic(?!s? Club|s Lab)"), "Daffodil International University Robotics"),
]

SKIP_DIRS = {"node_modules", ".next", ".git", "__pycache__"}
SKIP_FILES = {"fix-faq.py", "rename-club.py"}

changed = []

for f in ROOT.rglob("*"):
    if not f.is_file():
        continue
    if any(part in SKIP_DIRS for part in f.parts):
        continue
    if f.name in SKIP_FILES:
        continue
    if f.suffix not in EXTENSIONS:
        continue

    try:
        src = f.read_text(encoding="utf-8")
    except Exception:
        continue

    result = src
    for old, new in REPLACEMENTS:
        result = result.replace(old, new)
    for pattern, new in REGEX_REPLACEMENTS:
        result = pattern.sub(new, result)

    if result != src:
        f.write_text(result, encoding="utf-8")
        changed.append(str(f.relative_to(ROOT)))

print(f"Updated {len(changed)} file(s):")
for c in sorted(changed):
    print(" ", c)
