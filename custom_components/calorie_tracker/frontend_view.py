"""Serve the Calorie Tracker frontend with explicit content types.

A plain static path takes the Content-Type from the host's mimetypes table.
On some systems that maps ``.js`` to ``text/plain``, and browsers refuse to run
an ES module labelled that way, so the panel and cards silently never load.
This view serves the same files at the same URL prefix with the type set here.

Caching: hashed chunk files never change, so they are cached for a year.
Entry files (cards.js, calorie-tracker-panel.js) are revalidated on every load
via ETag, so a rebuilt bundle is picked up without clearing the browser cache.
"""

from __future__ import annotations

from pathlib import Path

from aiohttp import web

from homeassistant.components.http import HomeAssistantView

from .const import DOMAIN

FRONTEND_DIR = Path(__file__).parent / "frontend"
URL_PREFIX = f"/{DOMAIN}_frontend"

CONTENT_TYPES = {
    ".js": "text/javascript; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".map": "application/json; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".webp": "image/webp",
}


class CalorieTrackerFrontendView(HomeAssistantView):
    """Serve files from the integration's frontend folder."""

    url = URL_PREFIX + "/{path:.+}"
    name = f"{DOMAIN}:frontend"
    requires_auth = False  # loaded by the browser before a websocket exists

    async def get(self, request: web.Request, path: str) -> web.StreamResponse:
        """Return a frontend file with the right Content-Type."""
        hass = request.app["hass"]
        result = await hass.async_add_executor_job(_read_file, path)
        if result is None:
            raise web.HTTPNotFound

        body, content_type, etag, immutable = result
        cache = "public, max-age=31536000, immutable" if immutable else "no-cache"
        headers = {"Cache-Control": cache, "ETag": etag}
        if request.headers.get("If-None-Match") == etag:
            return web.Response(status=304, headers=headers)
        return web.Response(body=body, headers={**headers, "Content-Type": content_type})


def _read_file(path: str) -> tuple[bytes, str, str, bool] | None:
    """Read a file under FRONTEND_DIR, refusing anything outside it."""
    if path.startswith(("src/", "scripts/", "node_modules/")) or path.startswith("package"):
        return None
    root = FRONTEND_DIR.resolve()
    target = (root / path).resolve()
    if root not in target.parents or not target.is_file():
        return None
    content_type = CONTENT_TYPES.get(target.suffix.lower())
    if content_type is None:
        return None
    stat = target.stat()
    etag = f'"{stat.st_mtime_ns:x}-{stat.st_size:x}"'
    immutable = target.parent.name in ("chunks", "assets")
    return target.read_bytes(), content_type, etag, immutable
