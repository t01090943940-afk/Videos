src='site/src/'
page=open(src+'page.html').read()
js='\n'.join(open(src+f).read() for f in ['core.js','elements.js','console.js','sources.js','network.js','perf.js','app.js','shell.js'])
js=js.replace('</script>','<\\/script>')
open('site/index.html','w').write(page+'\n<script>\n"use strict";\n'.replace('"use strict";\n','')+js+'\n</script>\n')
print(len(page)+len(js))
