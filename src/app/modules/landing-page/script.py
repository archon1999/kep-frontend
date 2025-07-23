import os

root_dir = "apps/arena"

for dirpath, dirnames, filenames in os.walk(root_dir):
    for filename in filenames:
        filepath = os.path.join(dirpath, filename)
        if not filepath.endswith(".py"):
            continue
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
        except Exception as e:
            content = f"Не удалось прочитать файл: {e}"
        print(f"\n=== {filepath} ===\n{content}\n")
