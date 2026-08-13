#!/usr/bin/env python3
"""Local dev server for The Roll.

Plain `python3 -m http.server` lets the browser cache index.html, which
means edits silently don't show up — and if a file was renamed, the page
requests the old one, gets a 404, and quietly loads with no CSS or JS.
This sends no-cache headers so what you see is always what's on disk.

    python3 serve.py          # http://localhost:8747
    python3 serve.py 9000     # another port
"""

import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, fmt, *args):
        # keep 404s, drop the routine 200 noise
        if args and str(args[1]).startswith(('4', '5')):
            super().log_message(fmt, *args)


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8747
    handler = partial(NoCacheHandler, directory='.')
    print(f'The Roll -> http://localhost:{port}  (ctrl-c to stop)')
    ThreadingHTTPServer(('', port), handler).serve_forever()


if __name__ == '__main__':
    main()
