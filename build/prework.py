import os
import shutil
# from pathlib import Path

BUILD_PATH = 'build/crx/'

build_list = [
    '_locales/', 'content_scripts/', 'icons/', 'modules/', 'resources/', 'background.js', 'LICENSE',
    'manifest.json', 'options.html', 'options.js', 'README.md'
]

if os.path.exists(BUILD_PATH):
    shutil.rmtree(BUILD_PATH)

for file in build_list:
    if os.path.isdir(file):
        shutil.copytree(file, BUILD_PATH + file)
    else:
        shutil.copy(file, BUILD_PATH)

# for fp in Path(BUILD_PATH).iterdir():
#     if fp.is_file() and fp.suffix in ['js', 'html']:
#         pass
