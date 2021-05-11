from shutil import copyfile
from glob import iglob

js_files = filter(lambda file: not file.startswith('node_modules'), iglob('**/*.min.js', recursive=True))

for file in js_files:
    print(file)
    copyfile(file, file[:-6] + 'js')
