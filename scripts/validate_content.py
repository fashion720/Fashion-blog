from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
errors = []
posts = list((ROOT / "src/content/posts").glob("*.mdx"))

for path in posts:
    text = path.read_text()
    frontmatter = text.split("---", 2)[1] if text.count("---") >= 2 else ""
    if not re.search(r"^description:\s+.+$", frontmatter, re.MULTILINE):
        errors.append(f"{path}: missing description")
    if re.search(r"BootCream|Item 5::|\[fall\]\(/posts/12-fall-outfits-every-woman-needs\)s", text):
        errors.append(f"{path}: known typo or malformed link")
    if re.search(r"\]\([^)]*\]\(|\]\([^)]*$", text, re.MULTILINE):
        errors.append(f"{path}: suspicious markdown link syntax")

source_files = list((ROOT / "src").rglob("*.astro")) + list((ROOT / "src").rglob("*.ts"))
for path in source_files:
    text = path.read_text()
    if "adncjkfegdiufwegdiufewgdiuwegui" in text:
        errors.append(f"{path}: placeholder text remains")

print(f"Checked {len(posts)} posts and {len(source_files)} source files")
if errors:
    print("Validation failures:")
    print("\n".join(errors))
    sys.exit(1)
print("Content, metadata, and known-link checks passed")
