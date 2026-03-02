#!/usr/bin/env python3
"""Fetch all content URLs from DatoCMS and write url-list.md"""
import json
import os
import subprocess
import sys

TOKEN = os.environ.get('NUXT_DATO_API_TOKEN', '')
if not TOKEN:
    # Try loading from .env
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Walk up to find .env at project root
    search = script_dir
    for _ in range(10):
        env_path = os.path.join(search, '.env')
        if os.path.exists(env_path):
            with open(env_path) as f:
                for line in f:
                    line = line.strip()
                    if line.startswith('NUXT_DATO_API_TOKEN='):
                        TOKEN = line.split('=', 1)[1].strip().strip('"').strip("'")
            break
        search = os.path.dirname(search)

if not TOKEN:
    print("ERROR: Could not find NUXT_DATO_API_TOKEN in .env")
    sys.exit(1)
print(f"Token found: {TOKEN[:4]}...{TOKEN[-4:]}")

ENDPOINT = 'https://graphql.datocms.com/'
HEADERS = {
    'Authorization': f'Bearer {TOKEN}',
    'Content-Type': 'application/json',
}

def query_dato(query, variables=None):
    payload = {'query': query}
    if variables:
        payload['variables'] = variables
    result = subprocess.run(
        ['curl', '-s', '-X', 'POST', ENDPOINT,
         '-H', f'Authorization: Bearer {TOKEN}',
         '-H', 'Content-Type: application/json',
         '-d', json.dumps(payload)],
        capture_output=True, text=True
    )
    return json.loads(result.stdout)

# Fetch all web pages
print("Fetching web pages...")
wp_data = query_dato('{ allWebPages(first: 100, orderBy: [path_ASC]) { name path } }')
web_pages = wp_data['data']['allWebPages']
print(f"  Found {len(web_pages)} web pages")

# Fetch all articles (paginated)
print("Fetching articles...")
all_articles = []
for skip in range(0, 300, 100):
    data = query_dato(f'{{ allArticles(first: 100, skip: {skip}, orderBy: _firstPublishedAt_DESC) {{ identifier name }} }}')
    batch = data['data']['allArticles']
    all_articles.extend(batch)
    if len(batch) < 100:
        break
print(f"  Found {len(all_articles)} articles")

# Fetch image object count (too many to list individually)
print("Fetching image object count...")
io_data = query_dato('{ _allImageObjectsMeta { count } }')
io_count = io_data['data']['_allImageObjectsMeta']['count']
print(f"  Found {io_count} image objects")

# Fetch place count
print("Fetching place count...")
pl_data = query_dato('{ _allPlacesMeta { count } }')
pl_count = pl_data['data']['_allPlacesMeta']['count']
print(f"  Found {pl_count} places")

# Write url-list.md
output_path = os.path.join(os.path.dirname(__file__), 'url-list.md')

with open(output_path, 'w') as f:
    f.write('# Complete URL Inventory\n\n')
    f.write(f'**Generated:** {subprocess.run(["date", "-u", "+%Y-%m-%dT%H:%M:%SZ"], capture_output=True, text=True).stdout.strip()}\n\n')
    f.write('## Summary\n\n')
    f.write(f'| Content Type | Count |\n')
    f.write(f'|---|---|\n')
    f.write(f'| Web Pages (section pages) | {len(web_pages)} |\n')
    f.write(f'| Articles | {len(all_articles)} |\n')
    f.write(f'| Image Objects | {io_count} |\n')
    f.write(f'| Places | {pl_count} |\n')
    f.write(f'| **Total content items** | **{len(web_pages) + len(all_articles) + io_count + pl_count}** |\n\n')

    # Web pages
    f.write('## Web Pages (42)\n\n')
    f.write('These use the `/:section/:page` route pattern.\n\n')
    f.write('| # | Path | Name |\n')
    f.write('|---|------|------|\n')
    for i, wp in enumerate(web_pages, 1):
        f.write(f'| {i} | `{wp["path"]}` | {wp["name"]} |\n')

    # Identify duplicates (side-shows vs sideshows)
    paths = [wp['path'] for wp in web_pages]
    dupes = []
    for p in paths:
        if '/sideshows/' in p:
            canonical = p.replace('/sideshows/', '/side-shows/')
            if canonical in paths:
                dupes.append((p, canonical))
    if dupes:
        f.write('\n### Duplicate Path Variants\n\n')
        f.write('These `/sideshows/` paths have matching `/side-shows/` counterparts:\n\n')
        for dup, canon in dupes:
            f.write(f'- `{dup}` → duplicate of `{canon}`\n')

    # Articles
    f.write(f'\n## Articles ({len(all_articles)})\n\n')
    f.write('These use the `/articles/:id` route pattern.\n\n')
    f.write('| # | Path | Name |\n')
    f.write('|---|------|------|\n')
    for i, a in enumerate(all_articles, 1):
        f.write(f'| {i} | `/articles/{a["identifier"]}` | {a["name"]} |\n')

    # Image objects
    f.write(f'\n## Image Objects ({io_count})\n\n')
    f.write('These use the `/image-objects/:id` route pattern.\n')
    f.write(f'**{io_count} total** — too many to list individually. These are loaded by identifier and linked from articles and web pages.\n')
    f.write('Audit approach: programmatic sweep of all image object pages linked from articles and web pages.\n\n')

    # Places
    f.write(f'\n## Places ({pl_count})\n\n')
    f.write(f'**{pl_count} total** — these are data records accessed via `/api/places/:id`.\n')
    f.write('Places do not appear to have dedicated frontend routes but are used as related data in articles.\n')

print(f"\nWritten to {output_path}")
