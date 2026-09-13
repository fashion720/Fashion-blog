import os

def replace_in_files(directory, old_str, new_str, ext):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(ext):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if old_str in content:
                    content = content.replace(old_str, new_str)
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Updated {filepath}")

replace_in_files('src/content/posts', 'author: sara-khan', 'author: editorial-team', '.mdx')
replace_in_files('src/content/pages', 'Sara Khan', 'Outfit Edits Editorial Team', '.mdx') # in case
replace_in_files('src/pages', 'Sara Khan', 'Outfit Edits Editorial Team', '.astro')
